<?php
require_once 'src/Repository/EntityRepository.php';
require_once 'src/Class/Order.php';
require_once 'src/Class/OrderItem.php';
require_once 'src/Repository/OrderItemRepository.php';

/**
 * Classe OrderRepository
 * 
 * Gère l'accès aux données de l'entité Order
 * Toutes les opérations CRUD doivent passer par cette classe
 */
class OrderRepository extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Récupère un Order par son ID
     * 
     * @param mixed $id L'identifiant du Order
     * @return ?Order L'objet Order ou null si non trouvé
     */
    public function find($id): ?Order {
        // TODO: Implémenter la requête SQL
        // Exemple :
       
        $requete = $this->cnx->prepare("SELECT * FROM `Order` WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $entity = new Order($answer->id);
        $entity->setIdUser($answer->idUser);
        $entity->setDate($answer->date);
        
        return $entity;
       
        
        return null; // À remplacer par votre implémentation
    }

    public function findAllByUser($idUser): array {
        $requete = $this->cnx->prepare("SELECT * FROM `Order` WHERE idUser=:idUser");
        $requete->bindParam(':idUser', $idUser);
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach ($answer as $obj) {
            $entity = new Order($obj->id);
            $entity->setIdUser($obj->idUser);
            $entity->setDate($obj->date);
            array_push($res, $entity);
        }

        return $res;
    }

    /**
     * Récupère tous les Orders
     * 
     * @return array Tableau d'objets Order
     */
    public function findAll(): array {
        // TODO: Implémenter la requête SQL
        // Exemple :
       
        $requete = $this->cnx->prepare("SELECT * FROM `Order`");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach ($answer as $obj) {
            $entity = new Order($obj->id);
            $entity->setIdUser($obj->idUser);
            $entity->setDate($obj->date);
            array_push($res, $entity);
        }
        
        return $res;
        
        
        return []; // À remplacer par votre implémentation
    }

    public function fetchOrderItems($orderId): array {
        $requete = $this->cnx->prepare("SELECT * FROM `OrderItem` WHERE orderId=:orderId");
        $requete->bindParam(':orderId', $orderId);
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach ($answer as $obj) {
            $entity = new OrderItem($obj->id);
            $entity->setIdOrder($obj->orderId);
            $entity->setIdProduct($obj->productId);
            $entity->setQuantity($obj->quantity);
            array_push($res, $entity);
        }

        return $res;
    }

    /**
     * Sauvegarde un nouveau Order dans la base de données
     * 
     * @param mixed $entity L'objet Order à sauvegarder
     * @return bool true si succès, false sinon
     */
    public function save($entity): bool {
        // TODO: Implémenter la requête INSERT
        // Exemple :
        
        $requete = $this->cnx->prepare(
            "INSERT INTO `Order` (idUser, date) VALUES (:idUser, :date)"
        );
        $idUser = $entity->getidUser();
        $date = $entity->getdate();
        $requete->bindParam(':idUser', $idUser);
        $requete->bindParam(':date', $date);
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
     * Supprime un Order de la base de données
     * 
     * @param mixed $id L'identifiant du Order à supprimer
     * @return bool true si succès, false sinon
     */
    public function delete($id): bool {
        // TODO: Implémenter la requête DELETE
        // Exemple :
        /*
        $requete = $this->cnx->prepare("DELETE FROM `Order` WHERE id=:value");
        $requete->bindParam(':value', $id);
        return $requete->execute();
        */
        
        return false; // À remplacer par votre implémentation
    }

    /**
     * Met à jour un Order existant dans la base de données
     * 
     * @param mixed $entity L'objet Order à mettre à jour
     * @return bool true si succès, false sinon
     */
    public function update($entity): bool {
        // TODO: Implémenter la requête UPDATE
        // Exemple :
        /*
        $requete = $this->cnx->prepare(
            "UPDATE `Order` SET idUser=:idUser, date=:date WHERE id=:id"
        );
        $id = $entity->getId();
        $idUser = $entity->getidUser();
        $date = $entity->getdate();
        $requete->bindParam(':id', $id);
        $requete->bindParam(':idUser', $idUser);
        $requete->bindParam(':date', $date);
        return $requete->execute();
        */
        
        return false; // À remplacer par votre implémentation
    }

    // TODO: Ajouter vos méthodes de recherche personnalisées ici
    // Exemple :
    //
    // public function findAllByCategory($categoryId): array {
    //     $requete = $this->cnx->prepare("SELECT * FROM Order WHERE category_id=:cat");
    //     $requete->bindParam(':cat', $categoryId);
    //     $requete->execute();
    //     // ...
    // }
}
