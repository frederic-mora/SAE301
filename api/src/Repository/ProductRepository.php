<?php

require_once __DIR__ . '/EntityRepository.php';
require_once __DIR__ . '/../Class/Product.php';


/**
 *  Classe ProductRepository
 * 
 *  Cette classe représente le "stock" de Product.
 *  Toutes les opérations sur les Product doivent se faire via cette classe 
 *  qui tient "synchro" la bdd en conséquence.
 * 
 *  La classe hérite de EntityRepository ce qui oblige à définir les méthodes  (find, findAll ... )
 *  Mais il est tout à fait possible d'ajouter des méthodes supplémentaires si
 *  c'est utile !
 *  
 */
class ProductRepository extends EntityRepository {

    public function __construct(){
        // appel au constructeur de la classe mère (va ouvrir la connexion à la bdd)
        parent::__construct();
    }

    public function find($id): ?Product{
        /*
            La façon de faire une requête SQL ci-dessous est "meilleur" que celle vue
            au précédent semestre (cnx->query). Notamment l'utilisation de bindParam
            permet de vérifier que la valeur transmise est "safe" et de se prémunir
            d'injection SQL.
        */
        $requete = $this->cnx->prepare("select * from Product where id=:value"); // prepare la requête SQL
        $requete->bindParam(':value', $id); // fait le lien entre le "tag" :value et la valeur de $id
        $requete->execute(); // execute la requête
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer==false) return null; // may be false if the sql request failed (wrong $id value for example)
        
        $p = new Product($answer->id);
        $p->setName($answer->name);
        $p->setIdcategory($answer->category);
        $p->setPrice($answer->price);
        $p->setImageUrl($answer->imageUrl);
        return $p;
    }

    public function findAll(): array {
        $requete = $this->cnx->prepare("select * from Product");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);
        $res = [];
        foreach($answer as $obj){
            $p = new Product($obj->id);
            $p->setName($obj->name);
            $p->setIdcategory($obj->category);
            $p->setPrice($obj->price);
            $p->setImageUrl($obj->imageUrl);
            array_push($res, $p);
        }
        return $res;
    }

    public function save($product){
        $requete = $this->cnx->prepare("insert into Product (name, category, price, imageUrl) values (:name, :idcategory, :price, :imageUrl)");
        $name = $product->getName();
        $idcat = $product->getIdcategory();
        $price = $product->getPrice();
        $imageUrl = $product->getImageUrl();
        $requete->bindParam(':name', $name );
        $requete->bindParam(':idcategory', $idcat);
        $requete->bindParam(':price', $price);
        $requete->bindParam(':imageUrl', $imageUrl);
        $answer = $requete->execute();
        if ($answer){
            $id = $this->cnx->lastInsertId();
            $product->setId($id);
            return true;
        }
        return false;
    }

    public function delete($id){
        // Not implemented ! TODO when needed !
        return false;
    }

    public function update($product){
        // Not implemented ! TODO when needed !
        return false;
    }

   
    
}