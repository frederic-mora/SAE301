<?php

require_once __DIR__ . '/Entity.php';
// Inclure les nouvelles classes
require_once __DIR__ . '/OptionType.php';
require_once __DIR__ . '/OptionValue.php';
require_once __DIR__ . '/ProductVariant.php';

/**
 * Class Product
 * ...
 */
class Product extends Entity {
    private int $id; // id du produit
    private ?string $name = null; // nom du produit (nullable pour éviter erreur si non initialisé)
    private ?int $idcategory = null; // id de la catégorie du produit (nullable)

    private ?float $price = null; // prix de BASE du produit (nullable)

    private ?string $description = null;
    private ?string $imageUrl = null;
    private array $images = [];

    // --- AJOUTS US008 ---
    private array $options = []; // Array of OptionType objects
    private array $variants = []; // Array of ProductVariant objects
    // --- FIN AJOUTS US008 ---


    public function __construct(int $id){
        $this->id = $id;
    }

    /**
     * Get the value of id
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * Define how to convert/serialize a Product to a JSON format
     * ...
     */
    public function jsonSerialize(): array{
        return [
            "id" => $this->id,
            "name" => $this->name,
            "category" => $this->idcategory,
            "price" => $this->price, // Prix de base
            "description" => $this->description,
            "imageUrl" => $this->imageUrl,
            "images" => $this->images,
            "options" => $this->options,   // --- AJOUT US008 ---
            "variants" => $this->variants  // --- AJOUT US008 ---
        ];
    }

    /**
     * Get the value of name
     */

    public function getImages(): array {
        return $this->images;
    }
    public function setImages(array $images): self {
        $this->images = $images;
        return $this;
    }

    // --- AJOUTS US008 ---
    public function getOptions(): array {
        return $this->options;
    }
    public function setOptions(array $options): self {
        $this->options = $options;
        return $this;
    }

    public function getVariants(): array {
        return $this->variants;
    }
    public function setVariants(array $variants): self {
        $this->variants = $variants;
        return $this;
    }
    // --- FIN AJOUTS US008 ---


    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * Set the value of name
     *
     * @return  self
     */
    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    /**
     * Get the value of idcategory
     */
    public function getIdcategory(): ?int
    {
        return $this->idcategory;
    }

    /**
     * Set the value of idcategory
     *
     * @return  self
     */
    public function setIdcategory(int $idcategory): self
    {
        $this->idcategory = $idcategory;
        return $this;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */
    public function setId(int $id): self
    {
        $this->id = $id;
        return $this;
    }

    /**
     * Get the value of price
     */
    public function getPrice(): ?float
    {
        return $this->price;

    }
    /**
     * Set the value of price
     *
     * @return  self
     */
    public function setPrice(float $price): self
    {
        $this->price = $price;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }
    public function setDescription(string $description): self{
        $this->description = $description;
        return $this;
    }
    public function getImageUrl(): ?string
    {
        return $this->imageUrl;
    }
    public function setImageUrl(string $imageUrl): self
    {
        $this->imageUrl = $imageUrl;
        return $this;
    }
}