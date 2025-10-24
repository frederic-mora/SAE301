
<?php
require_once __DIR__ . '/EntityRepository.php';
require_once __DIR__ . '/../Class/Profil.php';

class ProfilRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    // Retourne un objet Profil
    public function find($id): ?Profil {
        $requete = $this->cnx->prepare("SELECT id, email, password, nom, prenom FROM profil WHERE id = :id");
        $requete->bindValue(':id', $id, PDO::PARAM_INT);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);

        if ($answer == false) return null;

        $p = new Profil((int)$answer->id);
        if (isset($answer->email)) $p->setEmail($answer->email);
        if (isset($answer->password)) $p->setPassword($answer->password);
        if (isset($answer->nom)) $p->setNom($answer->nom);
        if (isset($answer->prenom)) $p->setPrenom($answer->prenom);

        return $p;
    }

    // Retourne un tableau associatif ou null
    public function findById(int $id): ?array {
        $requete = $this->cnx->prepare("SELECT id, email, password, nom, prenom FROM profil WHERE id = :id");
        $requete->bindValue(':id', $id, PDO::PARAM_INT);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_ASSOC);

        return $answer ?: null;
    }

    // Retourne un tableau associatif ou null
    public function findByEmail(string $email): ?array {
        $requete = $this->cnx->prepare("SELECT id, email, password, nom, prenom FROM profil WHERE email = :email");
        $requete->bindValue(':email', $email, PDO::PARAM_STR);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_ASSOC);

        return $answer ?: null;
    }

    // Retourne tous les profils
    public function findAll(): array {
        $requete = $this->cnx->prepare("SELECT id, email, password, nom, prenom FROM profil");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_ASSOC);
        return $answer ?: [];
    }

    // Création d'un profil
    public function create(string $email, string $password, string $nom, string $prenom): ?int {
        $requete = $this->cnx->prepare(
            "INSERT INTO profil (email, password, nom, prenom) VALUES (:email, :password, :nom, :prenom)"
        );

        $requete->bindValue(':email', $email, PDO::PARAM_STR);
        $requete->bindValue(':password', $password, PDO::PARAM_STR);
        $requete->bindValue(':nom', $nom, PDO::PARAM_STR);
        $requete->bindValue(':prenom', $prenom, PDO::PARAM_STR);

        $ok = $requete->execute();
        if ($ok) {
            $id = $this->cnx->lastInsertId();
            return $id !== false ? (int)$id : null;
        }
        return null;
    }

    // Sauvegarde à partir d'un objet Profil
    public function save($profil): bool {
        if ($profil instanceof Profil) {
            $email = $profil->getEmail();
            $password = $profil->getPassword();
            $nom = $profil->getNom();
            $prenom = $profil->getPrenom();
            $requete = $this->cnx->prepare(
                "INSERT INTO profil (email, password, nom, prenom) VALUES (:email, :password, :nom, :prenom)"
            );
            $requete->bindValue(':email', $email, PDO::PARAM_STR);
            $requete->bindValue(':password', $password, PDO::PARAM_STR);
            $requete->bindValue(':nom', $nom, PDO::PARAM_STR);
            $requete->bindValue(':prenom', $prenom, PDO::PARAM_STR);
            $answer = $requete->execute();
            if ($answer) {
                $id = $this->cnx->lastInsertId();
                $profil->setId((int)$id);
                return true;
            }
        }
        return false;
    }

    // Update accepte un objet Profil ou un tableau associatif
    public function update($profil): bool {
        if ($profil instanceof Profil) {
            $id = $profil->getId();
            $email = $profil->getEmail();
            $password = $profil->getPassword();
            $nom = $profil->getNom();
            $prenom = $profil->getPrenom();
        } elseif (is_array($profil) && isset($profil['id'])) {
            $id = (int)$profil['id'];
            $email = $profil['email'] ?? null;
            $password = $profil['password'] ?? null;
            $nom = $profil['nom'] ?? null;
            $prenom = $profil['prenom'] ?? null;
        } else {
            return false;
        }

        $requete = $this->cnx->prepare(
            "UPDATE profil SET email = :email, password = :password, nom = :nom, prenom = :prenom WHERE id = :id"
        );

        $requete->bindValue(':id', $id, PDO::PARAM_INT);
        $requete->bindValue(':email', $email, PDO::PARAM_STR);
        $requete->bindValue(':password', $password, PDO::PARAM_STR);
        $requete->bindValue(':nom', $nom, PDO::PARAM_STR);
        $requete->bindValue(':prenom', $prenom, PDO::PARAM_STR);

        return $requete->execute();
    }

    public function delete($id): bool {
        $requete = $this->cnx->prepare("DELETE FROM profil WHERE id = :id");
        $requete->bindValue(':id', $id, PDO::PARAM_INT);
        return $requete->execute();
    }
}
