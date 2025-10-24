<?php
// api/src/Repository/CommandeRepository.php

require_once __DIR__ . '/EntityRepository.php'; // Classe parente abstraite
require_once __DIR__ . '/../Class/Commande.php'; // Entité Commande

/**
 * Classe CommandeRepository
 * Gère l'accès aux données de l'entité Commande (lecture, écriture BDD).
 * Hérite de EntityRepository pour la connexion BDD ($this->cnx).
 */
class CommandeRepository extends EntityRepository {

    public function __construct() {
        parent::__construct(); // Appelle le constructeur parent pour initialiser $this->cnx
    }

    /**
     * Sauvegarde une nouvelle commande et ses lignes associées dans la base de données.
     * Utilise une transaction SQL pour garantir que soit toutes les insertions réussissent,
     * soit aucune n'est effectuée (intégrité des données).
     * Met à jour l'objet Commande passé en paramètre avec son ID BDD et son numéro de commande généré.
     *
     * @param Commande $entity L'objet Commande à sauvegarder (contient profil_id, total, lignes).
     * @return bool true si la sauvegarde complète (commande + lignes) a réussi, false sinon.
     */
    public function save($entity): bool {

        // Vérifie que l'entité est bien une instance de Commande
        if (!($entity instanceof Commande)) {
            error_log("[CommandeRepository] La méthode save() attend une instance de Commande.");
            return false;
        }

        // 1. Générer un numéro de commande unique (ex: CMD-20251024-A3F1B9C2)
        // Rend le numéro plus lisible et potentiellement utile pour le client.
        $numero_commande = "CMD-" . date("Ymd") . "-" . strtoupper(bin2hex(random_bytes(4)));
        $entity->setNumeroCommande($numero_commande); // Met à jour l'objet Commande

        try {
            // 2. Démarrer une transaction SQL.
            // Toutes les requêtes suivantes seront mises en attente jusqu'à commit() ou rollback().
            $this->cnx->beginTransaction();

            // 3. Insérer la commande principale dans la table 'Commande'.
            $sqlCommande = "INSERT INTO Commande (profil_id, numero_commande, total, date_creation)
                            VALUES (:profil_id, :numero_commande, :total, NOW())"; // Ajout de NOW() pour la date
            $requeteCommande = $this->cnx->prepare($sqlCommande);

            // Récupère les valeurs de l'objet Commande
            $profil_id = $entity->getProfilId();
            $total = $entity->getTotal();

            // Lie les paramètres pour éviter les injections SQL
            $requeteCommande->bindParam(':profil_id', $profil_id, PDO::PARAM_INT);
            $requeteCommande->bindParam(':numero_commande', $numero_commande, PDO::PARAM_STR);
            $requeteCommande->bindParam(':total', $total); // PDO gère le type float/decimal

            // Exécute l'insertion de la commande
            $requeteCommande->execute();

            // 4. Récupérer l'ID auto-incrémenté de la commande qui vient d'être insérée.
            $commandeId = $this->cnx->lastInsertId();
            if (!$commandeId) {
                // Si lastInsertId échoue, c'est une erreur grave.
                throw new Exception("Impossible de récupérer l'ID de la commande insérée.");
            }
            $entity->setId((int)$commandeId); // Met à jour l'objet Commande avec son ID BDD

            // 5. Préparer la requête d'insertion pour les lignes de commande (une seule fois).
            $sqlLigne = "INSERT INTO LigneCommande (commande_id, produit_id, product_variant_id, quantite, prix_unitaire, options_description)
                         VALUES (:commande_id, :produit_id, :product_variant_id, :quantite, :prix_unitaire, :options_description)";
            $requeteLigne = $this->cnx->prepare($sqlLigne);

            // 6. Boucler sur chaque ligne (item) dans l'objet Commande et l'insérer.
            $lignes = $entity->getLignes();
            if (empty($lignes)) {
                throw new Exception("Impossible de sauvegarder une commande sans lignes de produits.");
            }

            foreach ($lignes as $ligne) {
                // $ligne est un objet stdClass venant du JSON décodé.
                // Extraction SÛRE des données de la ligne (avec valeurs par défaut ou null)
                $produit_id = isset($ligne->productId) ? (int)$ligne->productId : null; // ID du produit de base
                $variant_id = isset($ligne->id) ? (int)$ligne->id : null; // ID de la variante (vient de l'objet item)
                $quantite = isset($ligne->quantity) ? (int)$ligne->quantity : 0;
                $prix_unitaire = isset($ligne->price) ? (float)$ligne->price : 0.0;
                $options_desc = isset($ligne->optionsDescription) ? trim($ligne->optionsDescription) : null;

                // Validation minimale (quantité > 0)
                if ($quantite <= 0) {
                    error_log("[CommandeRepository] Ignorer ligne avec quantité invalide: " . print_r($ligne, true));
                    continue; // Ignore cette ligne et passe à la suivante
                }
                if ($variant_id === null) {
                    // Normalement, toutes les lignes devraient avoir un variant_id maintenant
                    error_log("[CommandeRepository] ERREUR: Ligne sans variant_id reçue: " . print_r($ligne, true));
                    throw new Exception("Donnée de ligne de commande invalide (variant_id manquant).");
                }


                // Lie les paramètres pour cette ligne spécifique
                $requeteLigne->bindParam(':commande_id', $commandeId, PDO::PARAM_INT);
                $requeteLigne->bindParam(':produit_id', $produit_id, PDO::PARAM_INT); // Peut être null si produit de base non stocké
                $requeteLigne->bindParam(':product_variant_id', $variant_id, PDO::PARAM_INT);
                $requeteLigne->bindParam(':quantite', $quantite, PDO::PARAM_INT);
                $requeteLigne->bindParam(':prix_unitaire', $prix_unitaire); // PDO gère le float
                $requeteLigne->bindParam(':options_description', $options_desc, PDO::PARAM_STR);

                // Exécute l'insertion de la ligne
                $requeteLigne->execute();
            }

            // 7. Si toutes les insertions (commande + toutes les lignes) ont réussi sans exception,
            // Valider la transaction : rend les changements permanents dans la BDD.
            $this->cnx->commit();
            return true; // Succès

        } catch (Exception $e) {
            // 8. Si une erreur (Exception) s'est produite à n'importe quelle étape (connexion, prepare, execute),
            // Annuler la transaction : toutes les modifications depuis beginTransaction() sont annulées.
            $this->cnx->rollBack();

            // Log de l'erreur détaillée pour le débogage côté serveur.
            // NE PAS renvoyer $e->getMessage() directement au client pour des raisons de sécurité.
            error_log("[CommandeRepository] Erreur lors de la sauvegarde de la commande (Transaction Rollback): " . $e->getMessage() . "\n" . $e->getTraceAsString());

            return false; // Échec
        }
    }

    // --- Méthodes non utilisées pour cette US, mais requises par l'abstraction ---
    // Il faudrait les implémenter si on a besoin de lire/modifier/supprimer des commandes existantes.

    public function find($id): ?Commande {
        error_log("[CommandeRepository] La méthode find() n'est pas implémentée.");
        // TODO: Implémenter si besoin de récupérer une commande par ID (avec ses lignes).
        return null;
    }

    public function findAll(): array {
        error_log("[CommandeRepository] La méthode findAll() n'est pas implémentée.");
        // TODO: Implémenter si besoin de lister les commandes (ex: pour un historique client).
        return [];
    }

    public function delete($id): bool {
        error_log("[CommandeRepository] La méthode delete() n'est pas implémentée (suppression non recommandée).");
        // En général, on ne supprime pas les commandes pour raisons comptables/historique.
        // On pourrait ajouter un statut 'annulée'.
        return false;
    }

    public function update($entity): bool {
        error_log("[CommandeRepository] La méthode update() n'est pas implémentée.");
        // La mise à jour d'une commande passée est complexe (paiement, stock, etc.).
        return false;
    }
}