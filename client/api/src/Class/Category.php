<?php

require_once ('Entity.php');

/**
 *  Class Category
 * 
 *  Représente un produit avec uniquement 3 propriétés (id, name, category)
 * 
 *  Implémente l'interface JsonSerializable 
 *  qui oblige à définir une méthode jsonSerialize. Cette méthode permet de dire comment les objets
 *  de la classe Category doivent être converti en JSON. Voire la méthode pour plus de détails.
 */
class Category extends Entity {
    private int $id; // id du produit
    private ?string $name = null; // nom du produit (nullable pour éviter erreur si non initialisé)
    private ?int $idcategory = null; // id de la catégorie du produit (nullable)
    private ?string $statut = null; // id de la collection du produit (nullable)
    private ?string $collection = null; // id de la collection du produit (nullable)
    private ?int $price = null; // prix du produit (nullable)
    private ?string $image = null; // id de l'image du produit (nullable)
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
     *  Define how to convert/serialize a Category to a JSON format
     *  This method will be automatically invoked by json_encode when apply to a Category
     * 
     *  En français : On sait qu'on aura besoin de convertir des Category en JSON pour les
     *  envoyer au client. La fonction json_encode sait comment convertir en JSON des données
     *  de type élémentaire. A savoir : des chaînes de caractères, des nombres, des booléens
     *  des tableaux ou des objets standards (stdClass). 
     *  Mais json_encode ne saura pas convertir un objet de type Category dont les propriétés sont
     *  privées de surcroit. Sauf si on définit la méthode JsonSerialize qui doit retourner une
     *  représentation d'un Category dans un format que json_encode sait convertir (ici un tableau associatif)
     * 
     *  Le fait que Category "implémente" l'interface JsonSerializable oblige à définir la méthode
     *  JsonSerialize et permet à json_encode de savoir comment convertir un Category en JSON.
     * 
     *  Parenthèse sur les "interfaces" : Une interface est une classe (abstraite en générale) qui
     *  regroupe un ensemble de méthodes. On dit que "une classe implémente une interface" au lieu de dire 
     *  que "une classe hérite d'une autre" uniquement parce qu'il n'y a pas de propriétés dans une "classe interface".
     * 
     *  Voir aussi : https://www.php.net/manual/en/class.jsonserializable.php
     *  
     */
    // Implémentation correcte de JsonSerializable : méthode nommée jsonSerialize()
    public function jsonSerialize(): mixed{
        return [
            "id" => $this->id,
            "name" => $this->name,
            
        ];
    }

    /**
     * Get the value of name
     */ 
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
     * Set the value of id
     *
     * @return  self
     */ 
    public function setId(int $id): self
    {
        $this->id = $id;
        return $this;
    }

    
    
    
}