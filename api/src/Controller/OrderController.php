<?php
require_once 'src/Controller/EntityController.php';
require_once 'src/Repository/OrderRepository.php';
require_once 'src/Repository/OrderItemRepository.php';
require_once 'src/Class/Order.php';
require_once 'src/Class/OrderItem.php';
require_once 'src/Class/HttpRequest.php';

/**
 * Classe OrderController
 * 
 * Gère les requêtes HTTP concernant l'entité Order
 * Hérite de Controller pour bénéficier de la méthode jsonResponse()
 */
class OrderController extends EntityController {

    private OrderRepository $repository;

    public function __construct() {
        $this->repository = new OrderRepository();
    }

    /**
     * Traite les requêtes GET
     * 
     * GET /api/{strtolower(Order)}s        → Récupère tous les Orders
     * GET /api/{strtolower(Order)}s/{id}   → Récupère un Order spécifique
     * 
     * @param HttpRequest $request
     * @return mixed Données à convertir en JSON, ou false en cas d'erreur
     */
    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId();
        
        if ($id) {
            // GET /api/{strtolower(Order)}s/{id}
            $entity = $this->repository->find($id);
            return $entity == null ? false : $entity;
        } else {
            // GET /api/{strtolower(Order)}s
            // TODO: Gérer les paramètres de filtrage si nécessaire
            // Exemple :
            $idUser = $request->getParam("idUser");
            if ($idUser) {
                return $this->repository->findAllByUser($idUser);
            }
            
            return $this->repository->findAll();
        }
    }

    /**
     * Traite les requêtes POST
     * 
     * POST /api/{strtolower(Order)}s       → Crée un nouveau Order
     * 
     * @param HttpRequest $request
     * @return mixed Le Order créé avec son ID, ou false en cas d'erreur
     */
    protected function processPostRequest(HttpRequest $request) {
        try {
            $json = $request->getJson();
            $obj = json_decode($json);
            
            // Validation basique
            if (!isset($obj->idUser) || !isset($obj->date)) {
                return ['success' => false, 'error' => 'idUser et date sont requis'];
            }

            // Vérifier que des items sont fournis
            if (!isset($obj->items) || !is_array($obj->items) || empty($obj->items)) {
                return ['success' => false, 'error' => 'Au moins un item est requis'];
            }

            // Créer la commande
            $order = new Order(0);
            $order->setIdUser($obj->idUser);
            $order->setDate($obj->date);
            
            // Sauvegarder la commande
            $orderSaved = $this->repository->save($order);
            if (!$orderSaved) {
                return ['success' => false, 'error' => 'Erreur lors de la création de la commande'];
            }

            // Récupérer l'ID de la commande créée
            $orderId = $order->getId();

            // Ajouter les items de la commande
            $orderItemRepository = new OrderItemRepository();
            foreach ($obj->items as $item) {
                // Validation de chaque item
                if (!isset($item->idProduct) || !isset($item->quantity)) {
                    return ['success' => false, 'error' => 'Chaque item doit avoir idProduct et quantity'];
                }

                // Créer et sauvegarder chaque OrderItem
                $orderItem = new OrderItem(0);
                $orderItem->setIdOrder($orderId);
                $orderItem->setIdProduct($item->idProduct);
                $orderItem->setQuantity($item->quantity);

                $itemSaved = $orderItemRepository->save($orderItem);
                if (!$itemSaved) {
                    return ['success' => false, 'error' => 'Erreur lors de l\'ajout d\'un item à la commande'];
                }
            }

            return ['success' => true, 'order' => $order];

        } catch (Exception $e) {
            error_log("Erreur lors de la création de la commande: " . $e->getMessage());
            return ['success' => false, 'error' => 'Erreur serveur: ' . $e->getMessage()];
        }
    }
}

//     /**
//      * Traite les requêtes DELETE
//      * 
//      * DELETE /api/{strtolower(Order)}s/{id} → Supprime un Order
//      * 
//      * @param HttpRequest $request
//      * @return mixed true si supprimé, false sinon
//      */
//     protected function processDeleteRequest(HttpRequest $request) {
//         // TODO: Implémenter la suppression
//         // Exemple :
//         /*
//         $id = $request->getId();
        
//         if (!$id) {
//             return false;
//         }
        
//         return $this->repository->delete($id);
//         */
        
//         return false; // À remplacer par votre implémentation
//     }

//     /**
//      * Traite les requêtes PATCH
//      * 
//      * PATCH /api/{strtolower(Order)}s/{id}  → Met à jour un Order
//      * 
//      * @param HttpRequest $request
//      * @return mixed Le Order modifié, ou false en cas d'erreur
//      */
//     protected function processPatchRequest(HttpRequest $request) {
//         // TODO: Implémenter la modification
//         // Exemple :
//         /*
//         $id = $request->getId();
        
//         if (!$id) {
//             return false;
//         }
        
//         $entity = $this->repository->find($id);
//         if (!$entity) {
//             return false;
//         }
        
//         $json = $request->getJson();
//         $obj = json_decode($json);
        
//         // Mise à jour des propriétés (uniquement celles fournies)
//         if (isset($obj->name)) {
//             $entity->setName($obj->name);
//         }
//         // TODO: Mettre à jour les autres propriétés
        
//         $ok = $this->repository->update($entity);
//         return $ok ? $entity : false;
//         */
        
//         return false; // À remplacer par votre implémentation
//     }

//     /**
//      * Traite les requêtes PUT
//      * 
//      * PUT /api/{strtolower(Order)}s/{id}    → Remplace complètement un Order
//      * 
//      * @param HttpRequest $request
//      * @return mixed Le Order remplacé, ou false en cas d'erreur
//      */
//     protected function processPutRequest(HttpRequest $request) {
//         // TODO: Implémenter le remplacement complet (optionnel)
//         // Note : PATCH est généralement préféré à PUT
//         return false;
//     }
// }
