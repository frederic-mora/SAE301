<?php
require_once __DIR__ . '/Entity.php';

class OptionValue extends Entity {
    private int $id;
    private int $option_type_id;
    private string $value;

    public function __construct(int $id) {
        $this->id = $id;
    }

    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "option_type_id" => $this->option_type_id,
            "value" => $this->value
        ];
    }

    // Getters et Setters
    public function getId(): int { return $this->id; }
    public function setId(int $id): self { $this->id = $id; return $this; }

    public function getOptionTypeId(): int { return $this->option_type_id; }
    public function setOptionTypeId(int $option_type_id): self { $this->option_type_id = $option_type_id; return $this; }

    public function getValue(): string { return $this->value; }
    public function setValue(string $value): self { $this->value = $value; return $this; }
}