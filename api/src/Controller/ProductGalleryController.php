<?php
require_once 'src/Controller/EntityController.php';
require_once 'src/Repository/ProductGalleryRepository.php';

/**
 * Classe ProductGalleryController
 * 
 * Gère les requêtes HTTP concernant l'entité ProductGallery
 * Hérite de Controller pour bénéficier de la méthode jsonResponse()
 */
class ProductGalleryController extends EntityController {

    private ProductGalleryRepository $repository;

    public function __construct() {
        $this->repository = new ProductGalleryRepository();
    }

    /**
     * Traite les requêtes GET
     * 
     * GET /api/{strtolower(ProductGallery)}s        → Récupère tous les ProductGallerys
     * GET /api/{strtolower(ProductGallery)}s/{id}   → Récupère un ProductGallery spécifique
     * 
     * @param HttpRequest $request
     * @return mixed Données à convertir en JSON, ou false en cas d'erreur
     */
    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId();
        
        if ($id) {
            // GET /api/{strtolower(ProductGallery)}s/{id}
            $entity = $this->repository->find($id);
            return $entity == null ? false : $entity;
        } else {
            $idProd = $request->getParam("idProd");
            if ($idProd) {
                return $this->repository->findWholeGallery($idProd);
            }
            else if ($path = $request->getParam("path")) {
                // GET /api/{strtolower(ProductGallery)}s
                return $this->repository->findPath($path);
            } else {
                return $this->repository->findAll();
            }
        }
    }

    /**
     * Traite les requêtes POST
     * 
     * POST /api/{strtolower(ProductGallery)}s       → Crée un nouveau ProductGallery
     * 
     * @param HttpRequest $request
     * @return mixed Le ProductGallery créé avec son ID, ou false en cas d'erreur
     */
    protected function processPostRequest(HttpRequest $request) {
        // TODO: Implémenter la création
        // Exemple :
        
        $json = $request->getJson();
        $obj = json_decode($json);
        // $p = new ProductGallery(0); // 0 est une valeur symbolique temporaire           
        
        // // Hydratation de l'objet
        // $p->setImage($obj->image ?? null);
        // $p->setIdProd($obj->idProd ?? null);

        // // Validation basique
        // if (!isset($obj->image)) {
        //     return false;
        // }
        
        $entity = new ProductGallery(0);
        $entity->setImage($obj->image);
        $entity->setIdProd($obj->idProd ?? null);
        $entity->setPath($obj->path);
        // TODO: Hydrater l'objet avec les données reçues
        
        $ok = $this->repository->save($entity);
        return $ok ? $entity : false;
        
        
        return false; // À remplacer par votre implémentation
    }

    // /**
    //  * Traite les requêtes DELETE
    //  * 
    //  * DELETE /api/{strtolower(ProductGallery)}s/{id} → Supprime un ProductGallery
    //  * 
    //  * @param HttpRequest $request
    //  * @return mixed true si supprimé, false sinon
    //  */
    // protected function processDeleteRequest(HttpRequest $request) {
    //     // TODO: Implémenter la suppression
    //     // Exemple :
    //     /*
    //     $id = $request->getId();
        
    //     if (!$id) {
    //         return false;
    //     }
        
    //     return $this->repository->delete($id);
    //     */
        
    //     return false; // À remplacer par votre implémentation
    // }

    // /**
    //  * Traite les requêtes PATCH
    //  * 
    //  * PATCH /api/{strtolower(ProductGallery)}s/{id}  → Met à jour un ProductGallery
    //  * 
    //  * @param HttpRequest $request
    //  * @return mixed Le ProductGallery modifié, ou false en cas d'erreur
    //  */
//     protected function processPatchRequest(HttpRequest $request) {
//         // TODO: Implémenter la modification
//         // Exemple :
        
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
//         if (isset($obj->image)) {
//             $entity->setImage($obj->image);
//         }
//         // TODO: Mettre à jour les autres propriétés
        
//         $ok = $this->repository->update($entity);
//         return $ok ? $entity : false;
    
//         return false; // À remplacer par votre implémentation
//     }

//     /**
//      * Traite les requêtes PUT
//      * 
//      * PUT /api/{strtolower(ProductGallery)}s/{id}    → Remplace complètement un ProductGallery
//      * 
//      * @param HttpRequest $request
//      * @return mixed Le ProductGallery remplacé, ou false en cas d'erreur
//      */
//     protected function processPutRequest(HttpRequest $request) {
//         // TODO: Implémenter le remplacement complet (optionnel)
//         // Note : PATCH est généralement préféré à PUT
//         return false;
//     }
}
