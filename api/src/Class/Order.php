<?php
require_once 'Entity.php';

/**
 * Class Order
 * 
 * Représente un objet Order
 * 
 * Implémente l'interface JsonSerializable pour permettre la conversion en JSON
 */
class Order extends Entity {
    private int $id;
    // TODO: Ajouter vos propriétés ici
    // Exemple :
    // private ?string $name = null;
    // private ?string $description = null;
    private ?float $idUser   = null;
    // private ?float $total    = null;
    private ?string $date    = null;

    public function __construct(int $id) {
        $this->id = $id;
    }

    /**
     * Définit comment convertir l'objet Order en JSON
     * 
     * @return mixed Tableau associatif représentant l'objet
     */
    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "idUser" => $this->idUser,
            "date" => $this->date,
            // TODO: Ajouter vos propriétés dans la sérialisation
            // "name" => $this->name,
            // "description" => $this->description,
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


    // TODO: Ajouter vos getters et setters ici
    // Exemple :
    public function getIdUser(): ?float {
        return $this->idUser;
    }
    public function setIdUser(?float $idUser): self {
        $this->idUser = $idUser;
        return $this;
    }

    public function getDate(): ?string {
        return $this->date;
    }

    public function setDate(?string $date): self {
        $this->date = $date;
        return $this;
    }

      
}

