<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/src/Controller/ProductController.php';
require_once __DIR__ . '/src/Controller/CategoryController.php';
require_once __DIR__ . '/src/Class/HttpRequest.php';
require_once __DIR__ . '/src/Controller/ProfilController.php';
require_once __DIR__ . '/src/Controller/CommandeController.php';

/** IMPORTANT
 *
 *  De part le .htaccess, toutes les requêtes seront redirigées vers ce fichier index.php
 *
 *  On pose le principe que toutes les requêtes, pour être valides, doivent être de la forme :
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
 *  On ajoutera des "routes" à $router si l'on a d'autres ressources à traiter.
 */
$router = [
    "products" => new ProductController(),
    "categories" => new CategoryController(),
    "profils" => new ProfilController(),
    "commandes" => new CommandeController()
];

// objet HttpRequest qui contient toutes les infos utiles sur la requête (voir class/HttpRequest.php)
$request = new HttpRequest();

// gestion des requêtes preflight (CORS)
if ($request->getMethod() == "OPTIONS") {
    http_response_code(200);
    exit();
}

// on récupère la ressource ciblée par la requête
$route = $request->getRessources();

if (isset($router[$route])) { // si on a un controleur pour cette ressource
    $ctrl = $router[$route];  // on le récupère
    $json = $ctrl->jsonResponse($request); // et on invoque jsonResponse pour obtenir la réponse (json) à la requête (voir class/Controller.php et ProductController.php)
    if ($json) {
        header("Content-type: application/json;charset=utf-8");
        echo $json;
    } else {
        http_response_code(404); // en cas de problème pour produire la réponse, on retourne un 404
    }
    die();
}
http_response_code(404); // si on a pas de controleur pour traiter la requête -> 404
die();
?>
