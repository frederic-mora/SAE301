<?php
require_once __DIR__ . '/Entity.php';

class ProductVariant extends Entity {
    private int $id;
    private int $product_id;
    private float $price;
    private int $stock;
    private array $option_values = []; // Array of OptionValue IDs

    public function __construct(int $id) {
        $this->id = $id;
    }

    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "product_id" => $this->product_id,
            "price" => $this->price,
            "stock" => $this->stock,
            "option_values" => $this->option_values
        ];
    }

    // Getters et Setters
    public function getId(): int { return $this->id; }
    public function setId(int $id): self { $this->id = $id; return $this; }

    public function getProductId(): int { return $this->product_id; }
    public function setProductId(int $product_id): self { $this->product_id = $product_id; return $this; }

    public function getPrice(): float { return $this->price; }
    public function setPrice(float $price): self { $this->price = $price; return $this; }

    public function getStock(): int { return $this->stock; }
    public function setStock(int $stock): self { $this->stock = $stock; return $this; }

    public function getOptionValues(): array { return $this->option_values; }
    public function setOptionValues(array $option_values): self { $this->option_values = $option_values; return $this; }
}