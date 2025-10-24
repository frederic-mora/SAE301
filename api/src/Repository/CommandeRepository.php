<?php
require_once __DIR__ . '/EntityRepository.php';
require_once __DIR__ . '/../Class/Commande.php';

/**
 * Classe CommandeRepository
 * Gère l'accès aux données de l'entité Commande
 */
class CommandeRepository extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Sauvegarde une nouvelle commande et ses lignes dans la base de données
     * Utilise une transaction pour assurer l'intégrité des données.
     *
     * @param Commande $entity L'objet Commande à sauvegarder
     * @return bool true si succès, false sinon
     */
    public function save($entity): bool {

        // 1. Générer un numéro de commande unique
        $numero_commande = "CMD-" . date("Ymd") . "-" . bin2hex(random_bytes(4));
        $entity->setNumeroCommande($numero_commande);

        try {
            // 2. Démarrer une transaction
            $this->cnx->beginTransaction();

            // 3. Insérer la commande principale
            $requete = $this->cnx->prepare(
                "INSERT INTO Commande (profil_id, numero_commande, total) 
                 VALUES (:profil_id, :numero_commande, :total)"
            );

            $profil_id = $entity->getProfilId();
            $total = $entity->getTotal();

            $requete->bindParam(':profil_id', $profil_id);
            $requete->bindParam(':numero_commande', $numero_commande);
            $requete->bindParam(':total', $total);

            $requete->execute();

            // 4. Récupérer l'ID de la commande insérée
            $commandeId = $this->cnx->lastInsertId();
            $entity->setId((int)$commandeId);

            // 5. Préparer l'insertion pour les lignes de commande
            $requeteLigne = $this->cnx->prepare(
                "INSERT INTO LigneCommande (commande_id, produit_id, quantite, prix_unitaire) 
                 VALUES (:commande_id, :produit_id, :quantite, :prix_unitaire)"
            );

            // 6. Insérer chaque ligne de commande
            foreach ($entity->getLignes() as $ligne) {
                // $ligne est un objet stdClass de-sérialisé du JSON
                $requeteLigne->bindParam(':commande_id', $commandeId);
                $requeteLigne->bindParam(':produit_id', $ligne->id);
                $requeteLigne->bindParam(':quantite', $ligne->quantity);
                $requeteLigne->bindParam(':prix_unitaire', $ligne->price);
                $requeteLigne->execute();
            }

            // 7. Valider la transaction
            $this->cnx->commit();
            return true;

        } catch (Exception $e) {
            // 8. Annuler la transaction en cas d'erreur
            $this->cnx->rollBack();
            error_log("Erreur sauvegarde commande : " . $e->getMessage());
            return false;
        }
    }

    // --- Méthodes non utilisées pour cette US, mais requises par l'abstraction ---

    public function find($id): ?Commande {
        // TODO: Implémenter si besoin de récupérer une commande par ID
        return null;
    }

    public function findAll(): array {
        // TODO: Implémenter si besoin de lister les commandes
        return [];
    }

    public function delete($id): bool {
        // En général, on ne supprime pas les commandes (comptabilité)
        return false;
    }

    public function update($entity): bool {
        return false;
    }
}