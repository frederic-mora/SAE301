<?php
require_once __DIR__ . '/EntityController.php';
require_once __DIR__ . '/../Repository/CommandeRepository.php';
require_once __DIR__ . '/../Class/Commande.php';

/**
 * Classe CommandeController
 * Gère les requêtes HTTP concernant les commandes
 */
class CommandeController extends EntityController {

    private CommandeRepository $repository;

    public function __construct() {
        $this->repository = new CommandeRepository();
    }

    /**
     * Traite les requêtes POST
     * POST /api/commandes       → Crée une nouvelle commande
     */
    protected function processPostRequest(HttpRequest $request) {

        // 1. Vérifier si l'utilisateur est connecté
        // On suppose que ProfilController stocke l'ID dans la session
        $profil_id = $_SESSION['profil_id'] ?? 1;

        // 2. Récupérer les données du panier envoyées en JSON
        $json = $request->getJson();
        $data = json_decode($json);

        // 3. Validation basique des données
        if (!isset($data->items) || !is_array($data->items) || empty($data->items) || !isset($data->total)) {
            http_response_code(400); // Bad Request
            return ["error" => "Données du panier invalides"];
        }

        // 4. Créer l'entité Commande
        $entity = new Commande(0); // ID temporaire
        $entity->setProfilId($profil_id);
        $entity->setTotal((float)$data->total);
        $entity->setLignes($data->items); // Les lignes sont des objets stdClass

        // 5. Sauvegarder en base via le Repository
        $ok = $this->repository->save($entity);

        // 6. Retourner la commande sauvegardée (avec son ID et numero_commande)
        return $ok ? $entity : false;
    }

    // --- Autres méthodes non implémentées pour cette US ---

    protected function processGetRequest(HttpRequest $request) {
        return false;
    }
    protected function processDeleteRequest(HttpRequest $request) {
        return false;
    }
    protected function processPatchRequest(HttpRequest $request) {
        return false;
    }
}