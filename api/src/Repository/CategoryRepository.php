<?php
// api/src/Repository/CategoryRepository.php
require_once __DIR__ . '/EntityRepository.php';
require_once __DIR__ . '/../Class/Category.php';
require_once __DIR__ . '/../Class/Product.php';

class CategoryRepository extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    public function find($id): ?Category {
        $requete = $this->cnx->prepare("SELECT * FROM Category WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);

        if ($answer == false) return null;

        $entity = new Category($answer->id);
        $entity->setName($answer->name);
        return $entity;
    }

    public function findAll(): array {
        $requete = $this->cnx->prepare("SELECT * FROM Category");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach ($answer as $obj) {
            $entity = new Category($obj->id);
            $entity->setName($obj->name);
            array_push($res, $entity);
        }

        return $res;
    }

    public function save($entity): bool {
        $requete = $this->cnx->prepare(
            "INSERT INTO Category (name) VALUES (:name)"
        );
        $name = $entity->getName();
        $requete->bindParam(':name', $name);
        $answer = $requete->execute();

        if ($answer) {
            $id = $this->cnx->lastInsertId();
            $entity->setId((int)$id);
            return true;
        }

        return false;
    }

    public function delete($id): bool {
        $requete = $this->cnx->prepare("DELETE FROM Category WHERE id=:value");
        $requete->bindParam(':value', $id);
        return $requete->execute();
    }

    public function update($entity): bool {
        $requete = $this->cnx->prepare(
            "UPDATE Category SET name=:name WHERE id=:id"
        );
        $id = $entity->getId();
        $name = $entity->getName();
        $requete->bindParam(':id', $id);
        $requete->bindParam(':name', $name);
        return $requete->execute();
    }

    /**
     * Récupère tous les produits d'une catégorie donnée.
     * Retourne un tableau associatif (chaque entrée = ligne de la table Product).
     *
     * @param mixed $categoryId
     * @return array
     */
    public function findAllByCategory($categoryId): array {
        if (is_numeric($categoryId)) {
            $requete = $this->cnx->prepare("SELECT * FROM Product WHERE category = :cat");
            $requete->bindValue(':cat', (int)$categoryId, PDO::PARAM_INT);
        } else {
            $name = trim(urldecode((string)$categoryId));
            $nameLower = mb_strtolower($name, 'UTF-8');

            $requete = $this->cnx->prepare(
                "SELECT p.* FROM Product p
                 JOIN Category c ON p.category = c.id
                 WHERE LOWER(TRIM(c.name)) = :name"
            );
            $requete->bindValue(':name', $nameLower, PDO::PARAM_STR);
        }

        $requete->execute();
        $rows = $requete->fetchAll(PDO::FETCH_ASSOC);

        return $rows ?: [];
    }
}
