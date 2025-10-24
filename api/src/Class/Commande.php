<?php
require_once 'Entity.php';

/**
 * Class Commande
 * Représente une commande
 */
class Commande extends Entity {
    private int $id;
    private int $profil_id;
    private ?string $numero_commande = null;
    private float $total;
    private ?string $date_creation = null;
    private array $lignes = []; // Va contenir les articles du panier

    public function __construct(int $id) {
        $this->id = $id;
    }

    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "profil_id" => $this->profil_id,
            "numero_commande" => $this->numero_commande,
            "total" => $this->total,
            "date_creation" => $this->date_creation,
            "lignes" => $this->lignes
        ];
    }

    // --- Getters et Setters ---

    public function getId(): int {
        return $this->id;
    }
    public function setId(int $id): self {
        $this->id = $id;
        return $this;
    }

    public function getProfilId(): int {
        return $this->profil_id;
    }
    public function setProfilId(int $profil_id): self {
        $this->profil_id = $profil_id;
        return $this;
    }

    public function getNumeroCommande(): ?string {
        return $this->numero_commande;
    }
    public function setNumeroCommande(string $numero_commande): self {
        $this->numero_commande = $numero_commande;
        return $this;
    }

    public function getTotal(): float {
        return $this->total;
    }
    public function setTotal(float $total): self {
        $this->total = $total;
        return $this;
    }

    public function getDateCreation(): ?string {
        return $this->date_creation;
    }
    public function setDateCreation(string $date_creation): self {
        $this->date_creation = $date_creation;
        return $this;
    }

    public function getLignes(): array {
        return $this->lignes;
    }
    public function setLignes(array $lignes): self {
        $this->lignes = $lignes;
        return $this;
    }
}