<?php
require_once 'Entity.php';

/**
 * Class User
 * 
 * Représente un objet User
 * 
 * Implémente l'interface JsonSerializable pour permettre la conversion en JSON
 */
class User extends Entity {
    private int $id;
    private ?string $name = null;
    private ?string $surname = null;
    private ?string $email = null;
    private ?string $password = null;
    // TODO: Ajouter vos propriétés ici
    // Exemple :
    // private ?string $name = null;
    // private ?string $description = null;

    public function __construct(int $id) {
        $this->id = $id;
    }

    /**
     * Définit comment convertir l'objet User en JSON
     * 
     * @return mixed Tableau associatif représentant l'objet
     */
    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "surname" => $this->surname,
            "email" => $this->email,
            // NE PAS inclure le mot de passe dans la réponse JSON pour la sécurité
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
    //
     public function getName(): ?string {
         return $this->name;
     }

    public function setName(string $name): self {
        $this->name = $name;
        return $this;
    }
     public function getSurname(): ?string {
         return $this->surname;
     }

    public function setSurname(string $surname): self {
        $this->surname = $surname;
        return $this;
    }
     public function getEmail(): ?string {
         return $this->email;
     }

    public function setEmail(string $email): self {
        $this->email = $email;
        return $this;
    }
    public function getPassword(): ?string {
        return $this->password;
    }

    public function setPassword(string $password): self {
        $this->password = $password;
        return $this;
    }

    //     return $this;
    // }
}
