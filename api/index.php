<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Start output buffering to capture unexpected HTML output before JSON
ob_start();
// // Autoriser ton origine client (ex: http://localhost:5173)
// header('Access-Control-Allow-Origin: http://localhost:5173');
// header('Access-Control-Allow-Credentials: true');
// // Autoriser les en-têtes nécessaires
// header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
// // Autoriser méthodes
// header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Répondre à la preflight sans body
    http_response_code(200);
    exit();
}
require_once "src/Controller/ProductController.php";
require_once "src/Controller/CategoryController.php";
require_once "src/Class/HttpRequest.php";
require_once "src/Controller/ProductGalleryController.php";
require_once "src/Controller/UserController.php";
require_once "src/Controller/OrderController.php";
require_once "src/Controller/OrderItemController.php";



/** IMPORTANT
 * 
 *  De part le .htaccess, toutes les requêtes seront redirigées vers ce fichier index.php
 * 
 *  On pose le principe que toutes les requêtes, pour être valides, doivent être dee la forme :
 * 
 *  http://.../api/ressources ou  http://.../api/ressources/{id}
 * 
 *  Par exemple : http://.../api/products ou  http://.../api/products/3
 */



/**
 *  $router est notre "routeur" rudimentaire.
 * 
 *  C'est un tableau associatif qui associe à chaque nom de ressource 
 *  le Controller en charge de traiter la requête.
 *  Ici ProductController est le controleur qui traitera toutes les requêtes ciblant la ressource "products"
 *  On ajoutera des "routes" à $router si l'on a d'autres ressource à traiter.
 */
try {
    $router = [
        "products" => new ProductController(),
        "categories" => new CategoryController(),
        "productgalleries" => new ProductGalleryController(),
        "users" => new UserController(),
        "orders" => new OrderController(),
        "orderItems" => new OrderItemController(),
    ];
} catch (Exception $e) {
    ob_get_clean();
    header('Content-Type: application/json;charset=utf-8');
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server initialization error: ' . $e->getMessage()]);
    die();
}

// objet HttpRequest qui contient toutes les infos utiles sur la requêtes (voir class/HttpRequest.php)
$request = new HttpRequest();

// gestion des requêtes preflight (CORS)
if ($request->getMethod() == "OPTIONS"){
    http_response_code(200);
    exit();
}

// on récupère la ressource ciblée par la requête
$route = $request->getRessources();

try {
    if ( isset($router[$route]) ){ // si on a un controleur pour cette ressource
        $ctrl = $router[$route];  // on le récupère
        $json = $ctrl->jsonResponse($request); // et on invoque jsonResponse pour obtenir la réponse (json) à la requête (voir class/Controller.php et ProductController.php)

        // Récupérer et vider tout contenu produit involontairement par le code inclus
        $extraOutput = (string) ob_get_clean();
        if (!empty($extraOutput)) {
            // Logguer la sortie inattendue pour diagnostic
            error_log("Unexpected output captured before JSON response: " . $extraOutput);
        }

        if ($json !== false && $json !== null) { 
            header("Content-type: application/json;charset=utf-8");
            echo $json;
        }
        else{
            header('Content-Type: application/json;charset=utf-8');
            http_response_code(400); // en cas de problème pour produire la réponse, on retourne un 400
            echo json_encode(['success' => false, 'error' => 'Failed to produce response', 'json' => $json]);
        }
        die();
    }
    http_response_code(404); // si on a pas de controlleur pour traiter la requête -> 404
    ob_get_clean();
    header('Content-Type: application/json;charset=utf-8');
    echo json_encode(['success' => false, 'error' => 'Route not found']);
    die();
} catch (Exception $e) {
    ob_get_clean();
    header('Content-Type: application/json;charset=utf-8');
    http_response_code(500);
    error_log("Exception in API request: " . $e->getMessage() . " | Trace: " . $e->getTraceAsString());
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage(), 'trace' => $e->getTraceAsString()]);
    die();
}

?>