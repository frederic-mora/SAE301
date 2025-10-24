<?php
require_once 'src/Controller/EntityController.php';
require_once 'src/Repository/UserRepository.php';

const BASE_URL = 'http://localhost:5173'; // Définir selon votre configuration
/**
 * Classe UserController
 * 
 * Gère les requêtes HTTP concernant l'entité User
 * Hérite de Controller pour bénéficier de la méthode jsonResponse()
 */
class UserController extends EntityController {

    private UserRepository $repository;

    public function __construct() {
        $this->repository = new UserRepository();
    }

    /**
     * Traite les requêtes GET
     * 
     * GET /api/{strtolower(User)}s        → Récupère tous les Users
     * GET /api/{strtolower(User)}s/{id}   → Récupère un User spécifique
     * 
     * @param HttpRequest $request
     * @return mixed Données à convertir en JSON, ou false en cas d'erreur
     */
    protected function processGetRequest(HttpRequest $request) {
        // Vérifier si c'est une demande de statut de connexion
        if ($request->getParam("checkAuth")) {
            try {
                $isLoggedIn = $this->repository->isLoggedIn();
                $currentUser = $isLoggedIn ? $this->repository->getCurrentUser() : null;
                return [
                    "success" => true,
                    "isLoggedIn" => $isLoggedIn,
                    "user" => $currentUser
                ];
            } catch (Exception $e) {
                return [
                    "success" => false,
                    "error" => "Erreur lors de la vérification de l'authentification"
                ];
            }
        }
        if ($request->getParam("currentUser")) {
            return [
                "user" => $this->repository->getCurrentUser()
            ];
        }
        if ($request->getParam("regenerateAuth")) {
            return [
                "session" => $this->repository->regenerateSession(),
                "user" => $this->repository->getCurrentUser()
            ];
        }

        
        $id = $request->getId();
        
        if ($id) {
            // GET /api/{strtolower(User)}s/{id}
            $entity = $this->repository->find($id);
            return $entity == null ? false : $entity;
        } else {
            // GET /api/{strtolower(User)}s
            // TODO: Gérer les paramètres de filtrage si nécessaire
            // Exemple :
             $email = $request->getParam("email");
             if ($email) {
                 return $this->repository->findUserByEmail($email);
             }
             
            
            return $this->repository->findAll();
        }
    }

    /**
     * Traite les requêtes POST
     * 
     * POST /api/{strtolower(User)}s       → Crée un nouveau User
     * 
     * @param HttpRequest $request
     * @return mixed Le User créé avec son ID, ou false en cas d'erreur
     */
    protected function processPostRequest(HttpRequest $request) {
        try {
            $json = $request->getJson();
            $obj = json_decode($json);

            if ($json === null || $obj === null) {
                return ['success' => false, 'error' => 'données JSON invalides'];
            }

            // Route de connexion
            if (isset($obj->action) && $obj->action === 'login') {
                if (!isset($obj->email) || !isset($obj->password)) {
                    return ['success' => false, 'error' => 'Email et mot de passe requis'];
                }
                $user = $this->repository->login($obj->email, $obj->password);
                if ($user!=null) {

                    if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
                    $_SESSION['user'] = $user;
                    return ['success' => true, 'user' => $user];
                    
                }
                else {
                    return ['success' => false, 'error' => 'Identifiants invalides'];
                }
            }

            // Route d'inscription
            if (isset($obj->action) && $obj->action === 'register') {
                if (!isset($obj->email) || !isset($obj->password) || 
                    !isset($obj->name) || !isset($obj->surname)) {
                    return ['success' => false, 'error' => 'Tous les champs sont requis'];
                }

                $entity = new User(0);
                $entity->setName($obj->name);
                $entity->setSurname($obj->surname);
                $entity->setEmail($obj->email);
                $entity->setPassword($obj->password);

                $ok = $this->repository->save($entity);
                if ($ok) {
                    return ['success' => true, 'user' => $entity];
                }
                return ['success' => false, 'error' => 'Erreur lors de l\'inscription'];
            }
            // route de mis à jour des informations personnelles
            if (isset($obj->action) && $obj->action === 'updateProfile') {
                // Paramètres requis
                if (!isset($obj->currentPassword)) {
                    return ['success' => false, 'error' => 'Mot de passe actuel requis pour la vérification'];
                }

                // Récupérer l'utilisateur soit via l'ID fourni, soit via la session courante
                $userId = $obj->id ?? null;
                
                if ($userId) {
                    // Utiliser l'ID fourni
                    $currentUser = $this->repository->find($userId);
                } else {
                    // Utiliser l'utilisateur de la session courante
                    $currentUser = $this->repository->getCurrentUser();
                }
                
                if (!$currentUser) {
                    return ['success' => false, 'error' => 'Utilisateur non trouvé'];
                }

                // Paramètres obligatoires (remplis par défaut avec les valeurs actuelles)
                $name = $obj->name ?? $currentUser->getName();
                $surname = $obj->surname ?? $currentUser->getSurname();
                $email = $obj->email ?? $currentUser->getEmail();
                $newPassword = $obj->newPassword ?? null;

                // Appeler la méthode updateProfile qui vérifie l'ancien mot de passe
                // Signature: updateProfile(userId, currentPassword, name, surname, email, newPassword)
                $result = $this->repository->updateProfile(
                    $currentUser->getId(),
                    $obj->currentPassword,
                    $name,
                    $surname,
                    $email,
                    $newPassword
                );

                return $result;
            }

            return ['success' => false, 'error' => 'Action non reconnue'];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
        
        
         
    }
  

    /**
     * Traite les requêtes DELETE
     * 
     * DELETE /api/{strtolower(User)}s/{id} → Supprime un User
     * 
     * @param HttpRequest $request
     * @return mixed true si supprimé, false sinon
     */
    protected function processDeleteRequest(HttpRequest $request) {
        // TODO: Implémenter la suppression
        // Exemple :
        /*
        $id = $request->getId();
        
        if (!$id) {
            return false;
        }
        
        return $this->repository->delete($id);
        */
        
        return false; // À remplacer par votre implémentation
    }

    /**
     * Traite les requêtes PATCH
     * 
     * PATCH /api/{strtolower(User)}s/{id}  → Met à jour un User
     * 
     * @param HttpRequest $request
     * @return mixed Le User modifié, ou false en cas d'erreur
     */
    protected function processPatchRequest(HttpRequest $request) {
        try {
            $json = $request->getJson();
            $obj = json_decode($json);

            if ($json === null || $obj === null) {
                return ['success' => false, 'error' => 'Données JSON invalides'];
            }

            // Route de mise à jour du profil via PATCH
            if (isset($obj->action) && $obj->action === 'updateProfile') {
                // Paramètres requis
                if (!isset($obj->currentPassword)) {
                    return ['success' => false, 'error' => 'Mot de passe actuel requis pour la vérification'];
                }

                // Récupérer l'utilisateur soit via l'ID fourni, soit via la session courante
                $userId = $obj->id ?? null;
                
                if ($userId) {
                    // Utiliser l'ID fourni
                    $currentUser = $this->repository->find($userId);
                } else {
                    // Utiliser l'utilisateur de la session courante
                    $currentUser = $this->repository->getCurrentUser();
                }
                
                if (!$currentUser) {
                    return ['success' => false, 'error' => 'Utilisateur non trouvé'];
                }

                // Paramètres obligatoires (remplis par défaut avec les valeurs actuelles)
                $name = $obj->name ?? $currentUser->getName();
                $surname = $obj->surname ?? $currentUser->getSurname();
                $email = $obj->email ?? $currentUser->getEmail();
                $newPassword = $obj->newPassword ?? null;

                // Appeler la méthode updateProfile qui vérifie l'ancien mot de passe
                // Signature: updateProfile(userId, currentPassword, name, surname, email, newPassword)
                $result = $this->repository->updateProfile(
                    $currentUser->getId(),
                    $obj->currentPassword,
                    $name,
                    $surname,
                    $email,
                    $newPassword
                );

                return $result;
            }

            // Fallback pour les anciennes routes PATCH
            $id = $request->getId();
            
            if (!$id) {
                return ['success' => false, 'error' => 'ID utilisateur requis'];
            }
            
            $entity = $this->repository->find($id);
            if (!$entity) {
                return ['success' => false, 'error' => 'Utilisateur non trouvé'];
            }
            
            // Mise à jour des propriétés (uniquement celles fournies)
            if (isset($obj->name)) {
                $entity->setName($obj->name);
            }
            if (isset($obj->surname)) {
                $entity->setSurname($obj->surname);
            }
            if (isset($obj->email)) {
                $entity->setEmail($obj->email);
            }
            if (isset($obj->password)) {
                $entity->setPassword($obj->password);
            }

            $ok = $this->repository->update($entity);
            return $ok ? ['success' => true, 'user' => $entity] : ['success' => false, 'error' => 'Erreur lors de la mise à jour'];
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
  }
    // /**
    //  * Traite les requêtes PUT
    //  * 
    //  * PUT /api/{strtolower(User)}s/{id}    → Remplace complètement un User
    //  * 
    //  * @param HttpRequest $request
    //  * @return mixed Le User remplacé, ou false en cas d'erreur
    //  */
    // protected function processPutRequest(HttpRequest $request) {
    //     // TODO: Implémenter le remplacement complet (optionnel)
    //     // Note : PATCH est généralement préféré à PUT
    //     return false;
    // }

        
    // protected function processPostRequest(HttpRequest $request) {
    //     $json = $request->getJson();
    //     $obj = json_decode($json);
        
    //     // Si c'est une demande de connexion
    //     if (isset($obj->action) && $obj->action === 'login') {
    //         $user = $this->repository->login($obj->email, $obj->password);
    //         if ($user) {
    //             header("Location: " . BASE_URL . "/dashboard");
    //             return $user;
    //         }
    //         return false;
    //     }
        
    //     // Si c'est une demande de déconnexion
    //     if (isset($obj->action) && $obj->action === 'logout') {
    //         $this->repository->logout();
    //         header("Location: " . BASE_URL . "/login");
    //         return true;
    //     }
        
    //     // Pour les autres requêtes POST, vérifier si l'utilisateur est connecté
    //     if (!$this->repository->isLoggedIn()) {
    //         header("HTTP/1.1 401 Unauthorized");
    //         return false;
    //     }
        
        // Le reste de votre code POST existant...
    //}
    
   