<?php
require_once __DIR__ . '/Entity.php';

class OptionType extends Entity {
    private int $id;
    private string $name;
    private array $values = []; // Array of OptionValue

    public function __construct(int $id) {
        $this->id = $id;
    }

    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "values" => $this->values
        ];
    }

    // Getters et Setters
    public function getId(): int { return $this->id; }
    public function setId(int $id): self { $this->id = $id; return $this; }

    public function getName(): string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }

    public function getValues(): array { return $this->values; }
    public function setValues(array $values): self { $this->values = $values; return $this; }
    public function addValue(OptionValue $value): self { $this->values[] = $value; return $this; }
}