<?php
require_once 'src/Controller/EntityController.php';
require_once 'src/Repository/OrderItemRepository.php';
require_once 'src/Class/OrderItem.php';

/**
 * Classe OrderItemController
 * 
 * Gère les requêtes HTTP concernant l'entité OrderItem
 * Hérite de Controller pour bénéficier de la méthode jsonResponse()
 */
class OrderItemController extends EntityController {

    private OrderItemRepository $repository;

    public function __construct() {
        $this->repository = new OrderItemRepository();
    }

    /**
     * Traite les requêtes GET
     * 
     * GET /api/{strtolower(OrderItem)}s        → Récupère tous les OrderItems
     * GET /api/{strtolower(OrderItem)}s/{id}   → Récupère un OrderItem spécifique
     * 
     * @param HttpRequest $request
     * @return mixed Données à convertir en JSON, ou false en cas d'erreur
     */
    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId();
        
        if ($id) {
            // GET /api/{strtolower(OrderItem)}s/{id}
            $entity = $this->repository->find($id);
            return $entity == null ? false : $entity;
        } else {
            // GET /api/{strtolower(OrderItem)}s
            // TODO: Gérer les paramètres de filtrage si nécessaire
            // Exemple :
            $orderId = $request->getParam("orderId");
            if ($orderId) {
                return $this->repository->findAllByOrder($orderId);
            }

            return $this->repository->findAll();
        }
    }

    /**
     * Traite les requêtes POST
     * 
     * POST /api/{strtolower(OrderItem)}s       → Crée un nouveau OrderItem
     * 
     * @param HttpRequest $request
     * @return mixed Le OrderItem créé avec son ID, ou false en cas d'erreur
     */
    protected function processPostRequest(HttpRequest $request) {
        // TODO: Implémenter la création
        // Exemple :
        /*
        $json = $request->getJson();
        $obj = json_decode($json);
        
        // Validation basique
        if (!isset($obj->name)) {
            return false;
        }
        
        $entity = new OrderItem(0);
        $entity->setName($obj->name);
        // TODO: Hydrater l'objet avec les données reçues
        
        $ok = $this->repository->save($entity);
        return $ok ? $entity : false;
        */
        
        return false; // À remplacer par votre implémentation
    }

    /**
     * Traite les requêtes DELETE
     * 
     * DELETE /api/{strtolower(OrderItem)}s/{id} → Supprime un OrderItem
     * 
     * @param HttpRequest $request
     * @return mixed true si supprimé, false sinon
     */
    protected function processDeleteRequest(HttpRequest $request) {
        // TODO: Implémenter la suppression
        // Exemple :
        /*
        $id = $request->getId();
        
        if (!$id) {
            return false;
        }
        
        return $this->repository->delete($id);
        */
        
        return false; // À remplacer par votre implémentation
    }

    /**
     * Traite les requêtes PATCH
     * 
     * PATCH /api/{strtolower(OrderItem)}s/{id}  → Met à jour un OrderItem
     * 
     * @param HttpRequest $request
     * @return mixed Le OrderItem modifié, ou false en cas d'erreur
     */
    protected function processPatchRequest(HttpRequest $request) {
        // TODO: Implémenter la modification
        // Exemple :
        /*
        $id = $request->getId();
        
        if (!$id) {
            return false;
        }
        
        $entity = $this->repository->find($id);
        if (!$entity) {
            return false;
        }
        
        $json = $request->getJson();
        $obj = json_decode($json);
        
        // Mise à jour des propriétés (uniquement celles fournies)
        if (isset($obj->name)) {
            $entity->setName($obj->name);
        }
        // TODO: Mettre à jour les autres propriétés
        
        $ok = $this->repository->update($entity);
        return $ok ? $entity : false;
        */
        
        return false; // À remplacer par votre implémentation
    }

    /**
     * Traite les requêtes PUT
     * 
     * PUT /api/{strtolower(OrderItem)}s/{id}    → Remplace complètement un OrderItem
     * 
     * @param HttpRequest $request
     * @return mixed Le OrderItem remplacé, ou false en cas d'erreur
     */
    protected function processPutRequest(HttpRequest $request) {
        // TODO: Implémenter le remplacement complet (optionnel)
        // Note : PATCH est généralement préféré à PUT
        return false;
    }
}
