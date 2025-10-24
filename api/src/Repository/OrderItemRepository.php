<?php
require_once 'src/Repository/EntityRepository.php';
require_once 'src/Class/OrderItem.php';

/**
 * Classe OrderItemRepository
 * 
 * Gère l'accès aux données de l'entité OrderItem
 * Toutes les opérations CRUD doivent passer par cette classe
 */
class OrderItemRepository extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Récupère un OrderItem par son ID
     * 
     * @param mixed $id L'identifiant du OrderItem
     * @return ?OrderItem L'objet OrderItem ou null si non trouvé
     */
    public function find($id): ?OrderItem {
        // TODO: Implémenter la requête SQL
        // Exemple :
        
        $requete = $this->cnx->prepare("SELECT * FROM OrderItem WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $entity = new OrderItem($answer->id);
        $entity->setIdOrder($answer->idOrder);
        $entity->setIdProduct($answer->idProduct);
        $entity->setQuantity($answer->quantity);
        
        return $entity;
    }

    /**
     * Récupère tous les OrderItems
     * 
     * @return array Tableau d'objets OrderItem
     */
    public function findAll(): array {
        // TODO: Implémenter la requête SQL
        // Exemple :
        
        $requete = $this->cnx->prepare("SELECT * FROM OrderItem");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach ($answer as $obj) {
            $entity = new OrderItem($obj->id);
            $entity->setIdOrder($obj->idOrder);
            $entity->setIdProduct($obj->idProduct);
            $entity->setQuantity($obj->quantity);
            array_push($res, $entity);
        }
        
        return $res;
    }

    /**
     * Sauvegarde un nouveau OrderItem dans la base de données
     * 
     * @param mixed $entity L'objet OrderItem à sauvegarder
     * @return bool true si succès, false sinon
     */
    public function save($entity): bool {
        // TODO: Implémenter la requête INSERT
        // Exemple :
        
        $requete = $this->cnx->prepare(
            "INSERT INTO OrderItem (idOrder, idProduct, quantity) VALUES (:idOrder, :idProduct, :quantity)"
        );
        $idOrder = $entity->getIdOrder();
        $idProduct = $entity->getIdProduct();
        $quantity = $entity->getQuantity();
        $requete->bindParam(':idOrder', $idOrder);
        $requete->bindParam(':idProduct', $idProduct);
        $requete->bindParam(':quantity', $quantity);
        $answer = $requete->execute();

        if ($answer) {
            $id = $this->cnx->lastInsertId();
            $entity->setId((int)$id);
            return true;
        }
        
        return false;
        
        
        return false; // À remplacer par votre implémentation
    }

    public function findAllByOrder($orderId): array {
        $requete = $this->cnx->prepare("SELECT * FROM OrderItem WHERE idOrder=:orderId");
        $requete->bindParam(':orderId', $orderId);
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach ($answer as $obj) {
            $entity = new OrderItem($obj->id);
            $entity->setIdOrder($obj->idOrder);
            $entity->setIdProduct($obj->idProduct);
            $entity->setQuantity($obj->quantity);
            array_push($res, $entity);
        }

        return $res;
    }

    /**
     * Supprime un OrderItem de la base de données
     * 
     * @param mixed $id L'identifiant du OrderItem à supprimer
     * @return bool true si succès, false sinon
     */
    public function delete($id): bool {
        // TODO: Implémenter la requête DELETE
        // Exemple :
        /*
        $requete = $this->cnx->prepare("DELETE FROM OrderItem WHERE id=:value");
        $requete->bindParam(':value', $id);
        return $requete->execute();
        */
        
        return false; // À remplacer par votre implémentation
    }

    /**
     * Met à jour un OrderItem existant dans la base de données
     * 
     * @param mixed $entity L'objet OrderItem à mettre à jour
     * @return bool true si succès, false sinon
     */
    public function update($entity): bool {
        // TODO: Implémenter la requête UPDATE
        // Exemple :
        /*
        $requete = $this->cnx->prepare(
            "UPDATE OrderItem SET name=:name, description=:description WHERE id=:id"
        );
        $id = $entity->getId();
        $name = $entity->getName();
        $description = $entity->getDescription();
        $requete->bindParam(':id', $id);
        $requete->bindParam(':name', $name);
        $requete->bindParam(':description', $description);
        return $requete->execute();
        */
        
        return false; // À remplacer par votre implémentation
    }

    // TODO: Ajouter vos méthodes de recherche personnalisées ici
    // Exemple :
    //
    // public function findAllByCategory($categoryId): array {
    //     $requete = $this->cnx->prepare("SELECT * FROM OrderItem WHERE category_id=:cat");
    //     $requete->bindParam(':cat', $categoryId);
    //     $requete->execute();
    //     // ...
    // }
}
