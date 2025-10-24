<?php
// api/src/Controller/CommandeController.php

require_once __DIR__ . '/EntityController.php'; // Hérite de EntityController
require_once __DIR__ . '/../Repository/CommandeRepository.php'; // Utilise CommandeRepository
require_once __DIR__ . '/../Class/Commande.php'; // Utilise l'entité Commande
require_once __DIR__ . '/../Class/HttpRequest.php'; // Pour typer $request

/**
 * Classe CommandeController
 * Gère les requêtes HTTP concernant les commandes (principalement la création).
 */
class CommandeController extends EntityController {

    private CommandeRepository $repository;

    public function __construct() {
        // Initialise le repository pour interagir avec la base de données
        $this->repository = new CommandeRepository();
    }

    /**
     * Traite les requêtes POST pour créer une nouvelle commande.
     * Attend les données du panier en JSON dans le corps de la requête.
     * URL attendue : POST /api/commandes
     *
     * @param HttpRequest $request L'objet encapsulant la requête HTTP.
     * @return Commande|array|false L'objet Commande créé si succès, un tableau d'erreur sinon, ou false.
     */
    protected function processPostRequest(HttpRequest $request) {

        // --- Vérification de la Session ---
        // Démarre la session si elle n'est pas déjà active
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Récupère l'ID du profil depuis la session.
        // Si absent, on met une valeur par défaut (ex: 1 pour un invité ou test)
        // **ATTENTION**: En production, il faudrait peut-être renvoyer une erreur 401 si non connecté.
        $profil_id = $_SESSION['profil_id'] ?? 1; // Préférer null si l'ID n'est pas trouvé

        // Log pour débogage : voir quel ID utilisateur est utilisé
        error_log("[CommandeController] Tentative de sauvegarde pour profil_id = " . ($profil_id ?? 'Non défini (null)'));

        // Bloque si aucun utilisateur n'est connecté (plus sûr)
        if ($profil_id === null) {
            http_response_code(401); // Unauthorized
            return ["error" => "Utilisateur non authentifié. Impossible de passer commande."];
        }
        // --- Fin Vérification Session ---


        // --- Traitement des données reçues ---
        $json = $request->getJson(); // Récupère le corps JSON de la requête
        $data = json_decode($json); // Tente de décoder le JSON en objet PHP (stdClass)

        // Validation basique des données reçues du frontend
        if ($data === null || !isset($data->items) || !is_array($data->items) || empty($data->items) || !isset($data->total)) {
            http_response_code(400); // Bad Request
            error_log("[CommandeController] Données JSON invalides ou manquantes reçues: " . $json);
            return ["error" => "Données du panier invalides ou manquantes."];
        }
        // --- Fin Traitement Données ---


        // --- Création de l'entité Commande ---
        $entity = new Commande(0); // ID temporaire (sera mis à jour par le repo si succès)
        $entity->setProfilId((int)$profil_id); // Assure que c'est un entier
        $entity->setTotal((float)$data->total); // Assure que c'est un float
        $entity->setLignes($data->items); // Les lignes sont les objets décodés du JSON (contiennent id variante, qté, prix, etc.)
        // Le numero_commande sera généré par le Repository
        // --- Fin Création Entité ---


        // --- Appel au Repository pour sauvegarder ---
        try {
            $ok = $this->repository->save($entity); // Tente la sauvegarde

            if ($ok) {
                // Si la sauvegarde réussit, le repository a mis à jour l'ID et le numero_commande de $entity
                http_response_code(201); // Created
                return $entity; // Retourne l'objet Commande complet
            } else {
                // Si save() retourne false (erreur non-exceptionnelle gérée dans le repo, comme transaction rollback)
                http_response_code(500); // Internal Server Error
                error_log("[CommandeController] Echec retourné par repository->save()");
                return ["error" => "La sauvegarde de la commande a échoué (détails dans les logs serveur)."];
            }
        } catch (Exception $e) {
            // Intercepte toute exception imprévue durant l'appel à save()
            http_response_code(500); // Internal Server Error
            error_log("[CommandeController] Exception lors de repository->save(): " . $e->getMessage());
            return ["error" => "Erreur serveur lors de la sauvegarde de la commande."];
        }
        // --- Fin Appel Repository ---
    }


    // --- Autres méthodes HTTP (GET, DELETE, PATCH) ---
    // Non implémentées pour les commandes dans cette version, renvoient une erreur 405 Method Not Allowed.

    protected function processGetRequest(HttpRequest $request) {
        http_response_code(405); // Method Not Allowed
        return ["error" => "Méthode GET non autorisée pour les commandes."];
    }
    protected function processDeleteRequest(HttpRequest $request) {
        http_response_code(405);
        return ["error" => "Méthode DELETE non autorisée pour les commandes."];
    }
    protected function processPatchRequest(HttpRequest $request) {
        http_response_code(405);
        return ["error" => "Méthode PATCH non autorisée pour les commandes."];
    }
    protected function processPutRequest(HttpRequest $request) {
        http_response_code(405);
        return ["error" => "Méthode PUT non autorisée pour les commandes."];
    }
}