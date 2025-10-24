<?php
require_once 'src/Repository/EntityRepository.php';
require_once 'src/Class/User.php';

/**
 * Classe UserRepository
 * 
 * Gère l'accès aux données de l'entité User
 * Toutes les opérations CRUD doivent passer par cette classe
 */
class UserRepository extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Récupère un User par son ID
     * 
     * @param mixed $id L'identifiant du User
     * @return ?User L'objet User ou null si non trouvé
     */
    public function find($id): ?User {
        // TODO: Implémenter la requête SQL
        // Exemple :
        
        $requete = $this->cnx->prepare("SELECT * FROM User WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $entity = new User($answer->id);
         $entity->setName($answer->name);
        $entity->setSurname($answer->surname);
        $entity->setEmail($answer->email);
        $entity->setPassword($answer->password);
        return $entity;
        
        
        return null; // À remplacer par votre implémentation
    }

    public function findUserByEmail($email): ?User {
        $requete = $this->cnx->prepare("SELECT * FROM User WHERE email=:email");
        $requete->bindParam(':email', $email);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);

        if ($answer == false) return null;

        $entity = new User($answer->id);
        $entity->setName($answer->name);
        $entity->setSurname($answer->surname);
        $entity->setEmail($answer->email);
        $entity->setPassword($answer->password);
        return $entity;
    }

    /**
     * Connecte un utilisateur (login)
     * Vérifie les credentials et initialise la session
     */
    public function login(string $email, string $password): ?User {
        try {
            // Configuration des cookies pour le développement local
            ini_set('session.cookie_samesite', 'None');
            ini_set('session.cookie_secure', '0');
            
            // Configurer les paramètres de session avant de la démarrer
            session_set_cookie_params([
                'lifetime' => 0,
                'path' => '/',
                'domain' => '',
                'secure' => false,  // Désactivé pour le développement local
                'httponly' => true,
                'samesite' => 'None'  // Permettre le cross-domain en développement
            ]);

            // Démarrer ou récupérer la session
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            // Si l'utilisateur est déjà authentifié, retourner l'utilisateur courant
            if (isset($_SESSION['auth']) && $_SESSION['auth'] === true) {
                return $this->getCurrentUser();
            }

            // Vérifie les credentials dans la base de données
            $requete = $this->cnx->prepare("SELECT * FROM User WHERE email = :email LIMIT 1");
            $requete->bindParam(':email', $email);
            $requete->execute();
            $user = $requete->fetch(PDO::FETCH_OBJ);
            
            if ($user && password_verify($password, $user->password)) {
                // Régénère l'ID de session pour la sécurité
                session_regenerate_id(true);
                
                // // Mettre à jour la base de données avec le timestamp de dernière connexion
                // $updateQuery = $this->cnx->prepare("UPDATE User SET last_login = :last_login WHERE id = :id");
                // $lastLogin = date('Y-m-d H:i:s');
                // $updateQuery->bindParam(':last_login', $lastLogin);
                // $updateQuery->bindParam(':id', $user->id);
                
                // try {
                //     $updateQuery->execute();
                // } catch (Exception $e) {
                //     // Si la colonne n'existe pas, continuer quand même (log pour info)
                //     error_log("Colonne 'last_login' non trouvée, UPDATE non effectué: " . $e->getMessage());
                // }
                
                // Crée l'objet User
                $userObject = new User($user->id);
                $userObject->setName($user->name);
                $userObject->setSurname($user->surname);
                $userObject->setEmail($user->email);
                
                // Configuration de la session
                $_SESSION['auth'] = true;
                $_SESSION['user_id'] = $user->id;
                $_SESSION['user_email'] = $user->email;
                $_SESSION['user_name'] = $user->name;
                // $_SESSION['last_activity'] = time();

                // Force l'envoi du cookie avec les paramètres adaptés au développement
                setcookie(session_name(), session_id(), [
                    'expires' => 0,
                    'path' => '/',
                    'domain' => '',
                    'secure' => false,  // Désactivé pour le développement local
                    'httponly' => true,
                    'samesite' => 'None'  // Permettre le cross-domain en développement
                ]);
                
                return $userObject;
            }
            
            // En cas d'échec, on nettoie la session
            $this->logout();
            return null;
            
        } catch (Exception $e) {
            error_log("Erreur lors de la connexion : " . $e->getMessage());
            $this->logout();
            throw $e;
        }
    }

    /**
     * Vérifie si un utilisateur est connecté
     */
    public function isLoggedIn(): bool {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Vérifier si l'utilisateur est authentifié (chercher 'auth' qui est défini dans login())
        if (!isset($_SESSION['auth']) || $_SESSION['auth'] !== true) {
            return false;
        }

        // Vérifier que l'ID utilisateur existe en session
        if (!isset($_SESSION['user_id'])) {
            return false;
        }

        // // Vérifier la dernière activité (timeout après 30 minutes d'inactivité)
        // if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 1800)) {
        //     $this->logout();
        //     return false;
        // }

        // // Mettre à jour le timestamp de dernière activité
        // $_SESSION['last_activity'] = time();
        
        return true;
    }

    /**
     * Récupère l'utilisateur courant
     */
    public function getCurrentUser(): ?User {
        if (!$this->isLoggedIn()) {
            return null;
        }

        return $this->find($_SESSION['user_id']);
    }

    /**
     * Déconnecte l'utilisateur
     */
    public function logout(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Détruit toutes les variables de session
        $_SESSION = array();
        
        // Si un cookie de session existe, le supprimer proprement
        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', [
                'expires' => time() - 3600,
                'path' => '/',
                'domain' => '',
                'secure' => false, // Désactivé pour le développement local
                'httponly' => true,
                'samesite' => 'None' // Permettre le cross-domain en développement
            ]);
        }
        
        // Détruit la session
        session_destroy();
    }

    /**
     * Régénère l'ID de session (sécurité)
     */
    public function regenerateSession(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Conserve les données de session
        $sessionData = $_SESSION;
        
        // Régénère l'ID de session
        session_regenerate_id(true);
        
        // Restaure les données
        $_SESSION = $sessionData;
    }

    // /**
    //  * Met à jour le profil d'un utilisateur connecté
    //  * Vérifie l'ancien mot de passe avant de permettre la modification
    /**
     * Met à jour le profil d'un utilisateur connecté
     * Vérifie l'ancien mot de passe avant de permettre la modification
     * Met à jour systématiquement name, surname, email
     * Et ajoute le changement de mot de passe si newPassword est fourni
     * 
     * @param int $userId L'ID de l'utilisateur à mettre à jour
     * @param string $currentPassword Le mot de passe actuel (OBLIGATOIRE pour vérification)
     * @param string $name Le nouveau nom (obligatoire)
     * @param string $surname Le nouveau prénom (obligatoire)
     * @param string $email Le nouvel email (obligatoire)
     * @param ?string $newPassword Le nouveau mot de passe (optionnel)
     * @return array ['success' => bool, 'message' => string, 'user' => ?User, 'error' => string]
     */
    public function updateProfile(int $userId, string $currentPassword, string $name, string $surname, string $email, ?string $newPassword = null): array {
        try {
            // Récupérer l'utilisateur actuel
            $user = $this->find($userId);
            if (!$user) {
                return ['success' => false, 'error' => 'Utilisateur non trouvé'];
            }

            // Vérifier le mot de passe actuel (OBLIGATOIRE)
            if (!password_verify($currentPassword, $user->getPassword())) {
                return ['success' => false, 'error' => 'Mot de passe actuel incorrect'];
            }

            // Vérifier l'unicité du nouvel email si différent de l'email actuel
            if ($email !== $user->getEmail()) {
                $checkEmail = $this->cnx->prepare("SELECT id FROM User WHERE email = :email AND id != :id");
                $checkEmail->bindParam(':email', $email);
                $checkEmail->bindParam(':id', $userId);
                $checkEmail->execute();
                
                if ($checkEmail->fetch()) {
                    return ['success' => false, 'error' => 'Cet email est déjà utilisé par un autre utilisateur'];
                }
            }

            // Préparer la requête UPDATE
            $updateFields = ["name=:name", "surname=:surname", "email=:email"];
            $params = [':id' => $userId, ':name' => $name, ':surname' => $surname, ':email' => $email];

            // Ajouter le nouveau mot de passe s'il est fourni
            if ($newPassword && !empty($newPassword)) {
                $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
                $updateFields[] = "password=:password";
                $params[':password'] = $hashedPassword;
            }

            // Construire et exécuter la requête UPDATE
            $query = "UPDATE User SET " . implode(", ", $updateFields) . " WHERE id=:id";
            $requete = $this->cnx->prepare($query);
            $success = $requete->execute($params);

            if ($success) {
                // Récupérer l'utilisateur mis à jour
                $updatedUser = $this->find($userId);
                
                return ['success' => true, 'message' => 'Profil mis à jour avec succès', 'user' => $updatedUser];
            }

            return ['success' => false, 'error' => 'Erreur lors de la mise à jour du profil'];

        } catch (Exception $e) {
            error_log("Erreur lors de la mise à jour du profil : " . $e->getMessage());
            return ['success' => false, 'error' => 'Erreur serveur: ' . $e->getMessage()];
        }
    }

    /**
     * Récupère tous les Users
     * 
     * @return array Tableau d'objets User
     */
    public function findAll(): array {
        // TODO: Implémenter la requête SQL
        // Exemple :
        
        $requete = $this->cnx->prepare("SELECT * FROM User");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach ($answer as $obj) {
            $entity = new User($obj->id);
            $entity->setName($obj->name);
            $entity->setSurname($obj->surname);
            $entity->setEmail($obj->email);
            $entity->setPassword($obj->password);
            array_push($res, $entity);
        }
        
        return $res;
        
        
        return []; // À remplacer par votre implémentation
    }


    
    public function fetchSession($id): ?User {
        session_start();
        if (isset($_SESSION['user'])) {
            
            return $_SESSION['user'];
        }
        else{
            $_SESSION['user'] = $this->find($id);
            header("Location: /login");
        }
        
        return $_SESSION['user'];
    }

        // $answer = $requete->fetch(PDO::FETCH_OBJ);

        // if ($answer == false) return null;

        // $entity = new User($answer->id);
        // $entity->setName($answer->name);
        // $entity->setSurname($answer->surname);
        // $entity->setEmail($answer->email);
        // $entity->setPassword($answer->password);
        // return $entity;
    

    public function save($entity): bool {
        try {
            // Vérifier si l'email existe déjà
            $checkEmail = $this->cnx->prepare("SELECT id FROM User WHERE email = :email");
            $email = $entity->getEmail();
            $checkEmail->bindParam(':email', $email);
            $checkEmail->execute();
            
            if ($checkEmail->fetch()) {
                throw new Exception("Cette adresse email est déjà utilisée");
            }

            // Hasher le mot de passe avec un coût de hachage approprié
            $hashedPassword = password_hash($entity->getPassword(), PASSWORD_BCRYPT, ['cost' => 12]);
            
            $requete = $this->cnx->prepare(
                "INSERT INTO User (name, surname, email, password) VALUES (:name, :surname, :email, :password)"
            );
            
            $name = $entity->getName();
            $surname = $entity->getSurname();
            
            $requete->bindParam(':name', $name);
            $requete->bindParam(':surname', $surname);
            $requete->bindParam(':email', $email);
            $requete->bindParam(':password', $hashedPassword);
            
            $answer = $requete->execute();

            if ($answer) {
                $id = $this->cnx->lastInsertId();
                $entity->setId((int)$id);
                return true;
            }
            
            return false;
            
        } catch (Exception $e) {
            error_log("Erreur lors de l'enregistrement de l'utilisateur : " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Supprime un User de la base de données
     * 
     * @param mixed $id L'identifiant du User à supprimer
     * @return bool true si succès, false sinon
     */
    public function delete($id): bool {
        // TODO: Implémenter la requête DELETE
        // Exemple :
        /*
        $requete = $this->cnx->prepare("DELETE FROM User WHERE id=:value");
        $requete->bindParam(':value', $id);
        return $requete->execute();
        */
        
        return false; // À remplacer par votre implémentation
    }

    /**
     * Met à jour un User existant dans la base de données
     * 
     * @param mixed $entity L'objet User à mettre à jour
     * @return bool true si succès, false sinon
     */
    public function update($entity): bool {
        try {
            $id = $entity->getId();
            $name = $entity->getName();
            $surname = $entity->getSurname();
            $email = $entity->getEmail();
            $password = $entity->getPassword();

            // Vérifier si l'email existe déjà pour un autre utilisateur
            $checkEmail = $this->cnx->prepare("SELECT id FROM User WHERE email = :email AND id != :id");
            $checkEmail->bindParam(':email', $email);
            $checkEmail->bindParam(':id', $id);
            $checkEmail->execute();
            
            if ($checkEmail->fetch()) {
                throw new Exception("Cette adresse email est déjà utilisé");
            }

            // Préparer les champs à mettre à jour
            $updateFields = ["name=:name", "surname=:surname", "email=:email"];
            $params = [':id' => $id, ':name' => $name, ':surname' => $surname, ':email' => $email];

            // Si un nouveau mot de passe est fourni, le hasher
            if (!empty($password)) {
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
                $updateFields[] = "password=:password";
                $params[':password'] = $hashedPassword;
            }

            // Construire et exécuter la requête UPDATE
            $query = "UPDATE User SET " . implode(", ", $updateFields) . " WHERE id=:id";
            $requete = $this->cnx->prepare($query);
            
            return $requete->execute($params);
            
        } catch (Exception $e) {
            error_log("Erreur lors de la mise à jour de l'utilisateur : " . $e->getMessage());
            throw $e;
        }
    }

    // TODO: Ajouter vos méthodes de recherche personnalisées ici
    // Exemple :
    //
    // public function findAllByCategory($categoryId): array {
    //     $requete = $this->cnx->prepare("SELECT * FROM User WHERE category_id=:cat");
    //     $requete->bindParam(':cat', $categoryId);
    //     $requete->execute();
    //     // ...
    // }
}
