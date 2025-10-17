<?php

require_once __DIR__ . '/EntityRepository.php';
require_once __DIR__ . '/../Class/Product.php';

class ProductRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    public function find($id): ?Product{
        $requete = $this->cnx->prepare("select * from Product where id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);

        if ($answer==false) return null;

        $p = new Product($answer->id);
        $p->setName($answer->name);
        $p->setIdcategory($answer->category);
        $p->setPrice($answer->price);
        $p->setDescription($answer->description);
        $p->setImageUrl($answer->imageUrl);

        // Récupération des images
        $images = $this->getImagesForProduct($answer->id);
        $p->setImages($images);

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
            $p->setDescription($obj->description);
            $p->setImageUrl($obj->imageUrl);

            // Récupération des images
            $images = $this->getImagesForProduct($obj->id);
            $p->setImages($images);

            array_push($res, $p);
        }
        return $res;
    }

    // Méthode pour récupérer les images d'un produit
    private function getImagesForProduct(int $productId): array {
        $stmt = $this->cnx->prepare("SELECT url FROM image WHERE produit_id = :productId");
        $stmt->bindParam(':productId', $productId);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $images = [];
        foreach ($rows as $row) {
            $images[] = ["url" => $row['url']];
        }
        return $images;
    }

    public function save($product){
        $requete = $this->cnx->prepare("insert into Product (name, category, price,description, imageUrl) values (:name, :idcategory, :price, :description, :imageUrl)");
        $name = $product->getName();
        $idcat = $product->getIdcategory();
        $price = $product->getPrice();
        $description = $product->getDescription();
        $imageUrl = $product->getImageUrl();
        $requete->bindParam(':name', $name );
        $requete->bindParam(':idcategory', $idcat);
        $requete->bindParam(':price', $price);
        $requete->bindParam(':description', $description);
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
        return false;
    }

    public function update($product){
        return false;
    }
}
