
<?php
require_once __DIR__ . '/Entity.php';
class Profil extends Entity implements JsonSerializable {
    private int $id;
    private ?string $email = null;
    private ?string $password = null;

    private ?string $nom = null;
    private ?string $prenom = null;

    public function __construct(int $id) {
        $this->id = $id;
    }

    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "email" => $this->email,
            "nom" => $this->nom,
            "prenom" => $this->prenom
        ];
    }

    public function getId(): int {
        return $this->id;
    }

    public function setId(int $id): self {
        $this->id = $id;
        return $this;
    }

    public function getEmail(): ?string {
        return $this->email;
    }
    public function setEmail(?string $email): self {
        $this->email = $email;
        return $this;
    }
    public function getPassword(): ?string {
        return $this->password;
    }
    public function setPassword(?string $password): self {
        $this->password = $password;
        return $this;
    }
    public function getNom(): ?string {
        return $this->nom;
    }
    public function setNom(?string $nom): self
    {
        $this->nom = $nom;
        return $this;
    }
    public function getPrenom(): ?string {
        return $this->prenom;
    }
    public function setPrenom(?string $prenom): self
    {
        $this->prenom = $prenom;
        return $this;
    }
}
