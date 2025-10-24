<?php
require_once 'Entity.php';

/**
 * Class OrderItem
 * 
 * Représente un objet OrderItem
 * 
 * Implémente l'interface JsonSerializable pour permettre la conversion en JSON
 */
class OrderItem extends Entity {
    private int $id;
    // TODO: Ajouter vos propriétés ici
    // Exemple :
    private ?int $idOrder = null;
    private ?int $idProduct = null;
    private ?int $quantity = null;

    public function __construct(int $id) {
        $this->id = $id;
    }

    /**
     * Définit comment convertir l'objet OrderItem en JSON
     * 
     * @return mixed Tableau associatif représentant l'objet
     */
    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "idOrder" => $this->idOrder,
            "idProduct" => $this->idProduct,
            "quantity" => $this->quantity,
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

    public function getIdOrder(): ?int {
        return $this->idOrder;
    }   
    public function setIdOrder(int $idOrder): self {
        $this->idOrder = $idOrder;
        return $this;
    }
    public function getIdProduct(): ?int {
        return $this->idProduct;
    }
    public function setIdProduct(int $idProduct): self {
        $this->idProduct = $idProduct;
        return $this;
    }
    public function getQuantity(): ?int {
        return $this->quantity;
    }
    public function setQuantity(int $quantity): self {
        $this->quantity = $quantity;
        return $this;
    }

    // TODO: Ajouter vos getters et setters ici
    // Exemple :
    //
    // public function getName(): ?string {
    //     return $this->name;
    // }
    //
    // public function setName(string $name): self {
    //     $this->name = $name;
    //     return $this;
    // }
}
