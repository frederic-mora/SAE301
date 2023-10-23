<?php
require_once "Controller/ProductController.php";
require_once "Class/HttpRequest.php";


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
function cors() {
    
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
    
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
        exit(0);
    }
    
   
}
cors();

/**
 *  $router est notre "routeur" rudimentaire.
 * 
 *  C'est un tableau associatif qui associe à chaque nom de ressource 
 *  le Controller en charge de traiter la requête.
 *  Ici ProductController est le controleur qui traitera toutes les requêtes ciblant la ressource "products"
 *  On ajoutera des "routes" à $router si l'on a d'autres ressource à traiter.
 */
$router = [
    "products" => new ProductController()
];

// objet HttpRequest qui contient toutes les infos utiles sur la requêtes (voir class/HttpRequest.php)
$request = new HttpRequest();

// on récupère la ressource ciblée par la requête
$route = $request->getRessources();

if ( isset($router[$route]) ){ // si on a un controleur pour cette ressource
    $ctrl = $router[$route];  // on le récupère
    $json = $ctrl->jsonResponse($request); // et on invoque jsonResponse pour obtenir la réponse (json) à la requête (voir class/Controller.php et ProductController.php)
    if ($json){ 
        header("Content-type: application/json;charset=utf-8");
        echo $json;
    }
    else{
        http_response_code(404); // en cas de problème pour produire la réponse, on retourne un 404
    }
    die();
}
http_response_code(404); // si on a pas de controlleur pour traiter la requête -> 404
die();

?>