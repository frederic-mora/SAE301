<?php
require_once 'EntityRepository.php';
require_once 'src/Class/ProductGallery.php';

/**
 * Classe ProductGalleryRepository
 * 
 * Gère l'accès aux données de l'entité ProductGallery
 * Toutes les opérations CRUD doivent passer par cette classe
 */
class ProductGalleryRepository extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Récupère un ProductGallery par son ID
     * 
     * @param mixed $id L'identifiant du ProductGallery
     * @return ?ProductGallery L'objet ProductGallery ou null si non trouvé
     */
    public function find($id): ?ProductGallery {
        // TODO: Implémenter la requête SQL
        // Exemple :
        
        $requete = $this->cnx->prepare("SELECT * FROM ProductGallery WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $entity = new ProductGallery($answer->id);
        // $entity->setName($answer->name);
        // TODO: Hydrater l'objet avec les données de la BDD
        
        return $entity;
        
        
        return null; // À remplacer par votre implémentation
    }

    /**
     * Récupère tous les ProductGallerys
     * 
     * @return array Tableau d'objets ProductGallery
     */
    public function findWholeGallery($idProd): array {
        // TODO: Implémenter la requête SQL
        // Exemple :
        
        $requete = $this->cnx->prepare("SELECT * FROM ProductGallery WHERE idProd=:value");
        $requete->bindParam(':value', $idProd); 
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach ($answer as $obj) {
            $entity = new ProductGallery($obj->id);
            $entity->setImage($obj->image);
            $entity->setIdProd($obj->idProd);
            $entity->setPath($obj->path);
            // $entity->setName($obj->name);
            // TODO: Hydrater chaque objet
            array_push($res, $entity);
        }
        
        return $res;
        
        
        return []; // À remplacer par votre implémentation
    }

    

    /**
     * Récupère tous les ProductGallerys
     * 
     * @return array Tableau d'objets ProductGallery
     */
    public function findAll(): array {
        // TODO: Implémenter la requête SQL
        // Exemple :
        
        $requete = $this->cnx->prepare("SELECT * FROM ProductGallery");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach ($answer as $obj) {
            $entity = new ProductGallery($obj->id);
            $entity->setImage($obj->image);
            $entity->setIdProd($obj->idProd);
            $entity->setPath($obj->path);
            // $entity->setName($obj->name);
            // TODO: Hydrater chaque objet
            array_push($res, $entity);
        }
        
        return $res;
        
        
        return []; // À remplacer par votre implémentation
    }
    public function findPath($path): array {
        $requete = $this->cnx->prepare("SELECT * FROM ProductGallery WHERE path=:value");
        $requete->bindParam(':value', $path);
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach ($answer as $obj) {
            $entity = new ProductGallery($obj->id);
            $entity->setImage($obj->image);
            $entity->setIdProd($obj->idProd);
            $entity->setPath($obj->path);
            array_push($res, $entity);
        }
        
        return $res;
    }

    /**
     * Sauvegarde un nouveau ProductGallery dans la base de données
     * 
     * @param mixed $entity L'objet ProductGallery à sauvegarder
     * @return bool true si succès, false sinon
     */
    public function save($entity): bool {
        // TODO: Implémenter la requête INSERT
        // Exemple :
        
        $requete = $this->cnx->prepare(
            "INSERT INTO ProductGallery (path, image) VALUES (:path, :image)"
        );
        $path = $entity->getPath();
        $image = $entity->getImage();
        $requete->bindParam(':path', $path);
        $requete->bindParam(':image', $image);
        $answer = $requete->execute();

        if ($answer) {
            $id = $this->cnx->lastInsertId();
            $entity->setId((int)$id);
            return true;
        }
        
        return false;
        
        
        return false; // À remplacer par votre implémentation
    }

    /**
     * Supprime un ProductGallery de la base de données
     * 
     * @param mixed $id L'identifiant du ProductGallery à supprimer
     * @return bool true si succès, false sinon
     */
    public function delete($id): bool {
        // TODO: Implémenter la requête DELETE
        // Exemple :
        
        $requete = $this->cnx->prepare("DELETE FROM ProductGallery WHERE id=:value");
        $requete->bindParam(':value', $id);
        return $requete->execute();
        
        
        return false; // À remplacer par votre implémentation
    }

    /**
     * Met à jour un ProductGallery existant dans la base de données
     * 
     * @param mixed $entity L'objet ProductGallery à mettre à jour
     * @return bool true si succès, false sinon
     */
    public function update($entity): bool {
        // TODO: Implémenter la requête UPDATE
        // Exemple :
        
        $requete = $this->cnx->prepare(
            "UPDATE ProductGallery SET name=:name, image=:image WHERE id=:id"
        );
        $id = $entity->getId();
        $name = $entity->getName();
        $image = $entity->getImage();
        $requete->bindParam(':id', $id);
        $requete->bindParam(':name', $name);
        $requete->bindParam(':image', $image);
        return $requete->execute();
        
        
        return false; // À remplacer par votre implémentation
    }

    // TODO: Ajouter vos méthodes de recherche personnalisées ici
    // Exemple :
    //
    // public function findAllByCategory($categoryId): array {
    //     $requete = $this->cnx->prepare("SELECT * FROM ProductGallery WHERE category_id=:cat");
    //     $requete->bindParam(':cat', $categoryId);
    //     $requete->execute();
    //     // ...
    // }
}
