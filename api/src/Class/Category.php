<?php
require_once __DIR__ . '/Entity.php';

/**
 * Class Category
 * 
 * Représente un objet Category
 * 
 * Implémente l'interface JsonSerializable pour permettre la conversion en JSON
 */
class Category extends Entity {
    private int $id;
    private string $name;


    public function __construct(int $id) {
        $this->id = $id;
        $this->name = "";
    }

    /**
     * Définit comment convertir l'objet Category en JSON
     * 
     * @return mixed Tableau associatif représentant l'objet
     */
    public function jsonSerialize(): array {
        return [
            "id" => $this->id,
            "name" => $this->name,
        ];
    }

    /**
     * Get the value of id
     */
    public function getId(): int {
        return $this->id;
    }

    /**
     * Set the value of id
     */
    public function setId(int $id): self {
        $this->id = $id;
        return $this;
    }


     public function getName(): ?string {
         return $this->name;
     }

     public function setName(string $name): self {
         $this->name = $name;
         return $this;
     }
}
