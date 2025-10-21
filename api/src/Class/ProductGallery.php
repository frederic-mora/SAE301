<?php
require_once 'Entity.php';

/**
 * Class ProductGallery
 * 
 * Représente un objet ProductGallery
 * 
 * Implémente l'interface JsonSerializable pour permettre la conversion en JSON
 */
class ProductGallery extends Entity {
    private int $id;
    private ?string $image = null; // Exemple de propriété
    private ?string $idProd = null; // Exemple de propriété
    private ?string $path = null;
    public function __construct(int $id) {
        $this->id = $id;
    }

    /**
     * Définit comment convertir l'objet ProductGallery en JSON
     * 
     * @return mixed Tableau associatif représentant l'objet
     */
    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "image" => $this->image,
            "idProd" => $this->idProd,
            "path" => $this->path
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

    /**
     * Get the value of image
     */
    public function getImage(): ?string {
        return $this->image;
    }

    /**
     * Set the value of image
     */
    public function setImage(string $image): self {
        $this->image = $image;
        return $this;
    }

    /**
     * Get the value of idProd
     */
    public function getIdProd(): ?string {
        return $this->idProd;
    }

    /**
     * Set the value of idProd
     */
    public function setIdProd(string $idProd): self {
        $this->idProd = $idProd;
        return $this;
    }   

    public function getPath(): ?string {
        return $this->path;
    }

    /**
     * Set the value of path
     */
    public function setPath(string $path): self {
        $this->path = $path;
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
