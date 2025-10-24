<?php

require_once __DIR__ . '/EntityRepository.php';
require_once __DIR__ . '/../Class/Product.php';

require_once __DIR__ . '/../Class/OptionType.php';
require_once __DIR__ . '/../Class/OptionValue.php';
require_once __DIR__ . '/../Class/ProductVariant.php';


class ProductRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    public function find($id): ?Product{

        $requete = $this->cnx->prepare("select *, stock from Product where id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);

        if ($answer==false) return null;

        $p = new Product($answer->id);
        $p->setName($answer->name);
        $p->setIdcategory($answer->category);
        $p->setPrice($answer->base_price ?? $answer->price); // Utiliser base_price
        $p->setDescription($answer->description);
        $p->setImageUrl($answer->imageUrl);
        $p->setStock($answer->stock ?? null);

        // Récupération des images
        $images = $this->getImagesForProduct($answer->id);
        $p->setImages($images);


        // Récupération des options et variantes
        $p->setOptions($this->getOptionsForProduct($answer->id));
        $p->setVariants($this->getVariantsForProduct($answer->id));

        $variants = $p->getVariants();
        if (!empty($variants)) {
            $totalStock = 0;
            foreach ($variants as $variant) {
                $totalStock += $variant->getStock(); // ProductVariant a une méthode getStock()
            }
            $p->setTotalStock($totalStock);
        } else {
            // Pas de variantes, utilise le stock du produit de base
            $p->setTotalStock($p->getStock() ?? 0);
        }


        return $p;
    }

    public function findAll(): array {

        $requete = $this->cnx->prepare("select *, stock from Product");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);
        $res = [];
        foreach($answer as $obj){
            $p = new Product($obj->id);
            $p->setName($obj->name);
            $p->setIdcategory($obj->category);
            $p->setPrice($obj->base_price ?? $obj->price); // Utiliser base_price
            $p->setDescription($obj->description);
            $p->setImageUrl($obj->imageUrl);
            $p->setStock($obj->stock ?? null);

            // Récupération des images
            $images = $this->getImagesForProduct($obj->id);
            $p->setImages($images);


            // Récupération des options et variantes
            $p->setOptions($this->getOptionsForProduct($obj->id));
            $p->setVariants($this->getVariantsForProduct($obj->id));
            // --- FIN AJOUTS US008 ---


            $variants = $p->getVariants();
            if (!empty($variants)) {
                $totalStock = 0;
                foreach ($variants as $variant) {
                    $totalStock += $variant->getStock();
                }
                $p->setTotalStock($totalStock);
            } else {

                $p->setTotalStock($p->getStock() ?? 0);
            }

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


    /**
     * Récupère les types d'options et leurs valeurs pour un produit donné
     */
    private function getOptionsForProduct(int $productId): array {
        $sql = "SELECT DISTINCT
                    ot.id as option_type_id,
                    ot.name as option_type_name,
                    ov.id as option_value_id,
                    ov.value as option_value_value
                FROM ProductVariant pv
                JOIN VariantOptionValue vov ON pv.id = vov.product_variant_id
                JOIN OptionValue ov ON vov.option_value_id = ov.id
                JOIN OptionType ot ON ov.option_type_id = ot.id
                WHERE pv.product_id = :productId
                ORDER BY ot.id, ov.id";

        $stmt = $this->cnx->prepare($sql);
        $stmt->bindParam(':productId', $productId);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $optionTypes = [];
        foreach ($rows as $row) {
            $typeId = $row['option_type_id'];
            if (!isset($optionTypes[$typeId])) {
                $optionType = new OptionType((int)$typeId);
                $optionType->setName($row['option_type_name']);
                $optionTypes[$typeId] = $optionType;
            }

            $optionValue = new OptionValue((int)$row['option_value_id']);
            $optionValue->setOptionTypeId((int)$typeId);
            $optionValue->setValue($row['option_value_value']);

            // Ajoute la valeur seulement si elle n'existe pas déjà
            $existingValues = $optionTypes[$typeId]->getValues();
            $found = false;
            foreach ($existingValues as $val) {
                if ($val->getId() == $optionValue->getId()) {
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $optionTypes[$typeId]->addValue($optionValue);
            }
        }

        return array_values($optionTypes);
    }

    /**
     * Récupère les variantes d'un produit
     */
    private function getVariantsForProduct(int $productId): array {
        $sql = "SELECT * FROM ProductVariant WHERE product_id = :productId";
        $stmt = $this->cnx->prepare($sql);
        $stmt->bindParam(':productId', $productId);
        $stmt->execute();
        $variantRows = $stmt->fetchAll(PDO::FETCH_OBJ);

        $variants = [];
        foreach ($variantRows as $row) {
            $variant = new ProductVariant((int)$row->id);
            $variant->setProductId((int)$row->product_id);
            $variant->setPrice((float)$row->price);
            $variant->setStock((int)$row->stock);


            $sql_values = "SELECT option_value_id FROM VariantOptionValue WHERE product_variant_id = :variantId";
            $stmt_values = $this->cnx->prepare($sql_values);
            $stmt_values->bindValue(':variantId', $row->id);
            $stmt_values->execute();
            $valueIds = $stmt_values->fetchAll(PDO::FETCH_COLUMN);

            $variant->setOptionValues(array_map('intval', $valueIds));

            $variants[] = $variant;
        }

        return $variants;
    }

    public function save($product){

        return false;
    }

    public function delete($id){
        return false;
    }

    public function update($product){
        return false;
    }
}