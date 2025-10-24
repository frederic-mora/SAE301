
<?php
// php
// api/src/Controller/ProfilController.php

require_once __DIR__ . '/../Repository/ProfilRepository.php';

class ProfilController {
    private $repo;

    public function __construct() {
        $this->repo = new ProfilRepository();
    }

    protected function processGetRequest($request) {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);

        // Endpoint dédié : /api/profils/account ou /profils/account
        if (strpos($path, '/profils/account') !== false || strpos($path, '/account/') !== false || preg_match('#/profils/account/?$#', $path)) {
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            if (empty($_SESSION['profil_id'])) {
                http_response_code(401);
                return ['error' => 'Non authentifié'];
            }
            $id = (int)$_SESSION['profil_id'];
            $profil = $this->repo->findById($id);
            if (!$profil) {
                http_response_code(404);
                return ['error' => 'Profil introuvable'];
            }
            // Ne jamais exposer le mot de passe
            if (is_array($profil) && isset($profil['password'])) {
                unset($profil['password']);
            } elseif (is_object($profil) && method_exists($profil, 'getPassword')) {
                // si le repo retourne un objet, transformer ou supprimer le champ
                // ici on convertit en tableau minimal
                $profil = [
                    'id' => method_exists($profil, 'getId') ? (int)$profil->getId() : null,
                    'email' => method_exists($profil, 'getEmail') ? $profil->getEmail() : null,
                    'nom' => method_exists($profil, 'getNom') ? $profil->getNom() : null,
                    'prenom' => method_exists($profil, 'getPrenom') ? $profil->getPrenom() : null,
                ];
            }

            http_response_code(200);
            return ['user' => $profil];
        }

        // Autres GETs -> route non trouvée (ou adapter selon besoins)
        http_response_code(404);
        return ['error' => 'Route non trouvée'];
    }

    protected function processPostRequest($request) {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        // Inscription
        if ($request->getRessources() === 'profils' && $path === '/api/profils') {
            $email = trim($body['email'] ?? '');
            $password = $body['password'] ?? '';
            $nom = trim($body['nom'] ?? '');
            $prenom = trim($body['prenom'] ?? '');

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                return ['error' => 'Email invalide'];
            }
            if (strlen($password) < 8) {
                http_response_code(400);
                return ['error' => 'Mot de passe trop court (min 8 caractères)'];
            }
            if ($this->repo->findByEmail($email)) {
                http_response_code(409);
                return ['error' => 'Email déjà utilisé'];
            }

            $hash = password_hash($password, PASSWORD_BCRYPT);
            $id = $this->repo->create($email, $hash, $nom, $prenom);
            if ($id) {
                http_response_code(201);
                return ['message' => 'Compte créé', 'id' => (int)$id];
            }
            http_response_code(500);
            return ['error' => 'Erreur serveur lors de la création du compte'];
        }

        // Update profil (accept path contenant le segment)
        if (strpos($path, '/profils/account/update') !== false || strpos($path, '/account/update') !== false) {

            $selectorEmail = trim($body['email'] ?? '');
            if ($selectorEmail === '') {
                http_response_code(400);
                return ['error' => 'Email requis pour identifier le profil'];
            }

            $profil = $this->repo->findByEmail($selectorEmail);
            if (!$profil) {
                error_log("Profil introuvable pour email: " . $selectorEmail);
                http_response_code(404);
                return ['error' => 'Profil introuvable'];
            }

            // Récupère l'id du profil (tableau ou objet)
            $profilId = null;
            if (is_array($profil) && isset($profil['id'])) {
                $profilId = (int)$profil['id'];
            } elseif (is_object($profil) && method_exists($profil, 'getId')) {
                $profilId = (int)$profil->getId();
                // convertir en tableau si nécessaire pour update repo
                $profil = [
                    'id' => $profilId,
                    'nom' => method_exists($profil, 'getNom') ? $profil->getNom() : null,
                    'prenom' => method_exists($profil, 'getPrenom') ? $profil->getPrenom() : null,
                    'email' => method_exists($profil, 'getEmail') ? $profil->getEmail() : null,
                ];
            }

            $updated = false;

            // Mettre à jour nom/prenom uniquement si non vides
            if (isset($body['nom']) && trim($body['nom']) !== '') {
                $profil['nom'] = trim($body['nom']);
                $updated = true;
            }
            if (isset($body['prenom']) && trim($body['prenom']) !== '') {
                $profil['prenom'] = trim($body['prenom']);
                $updated = true;
            }

            // Changement d'email si new_email fourni et valide
            if (isset($body['new_email']) && trim($body['new_email']) !== '') {
                $newEmail = trim($body['new_email']);
                if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
                    http_response_code(400);
                    return ['error' => 'Email invalide'];
                }
                $profilExist = $this->repo->findByEmail($newEmail);
                $existId = null;
                if ($profilExist) {
                    if (is_array($profilExist) && isset($profilExist['id'])) {
                        $existId = (int)$profilExist['id'];
                    } elseif (is_object($profilExist) && method_exists($profilExist, 'getId')) {
                        $existId = (int)$profilExist->getId();
                    }
                }
                if ($existId !== null && $existId !== $profilId) {
                    http_response_code(409);
                    return ['error' => 'Email déjà utilisé'];
                }
                $profil['email'] = $newEmail;
                $updated = true;
            }

            // Mot de passe : uniquement si longueur >= 8
            if (isset($body['password']) && trim($body['password']) !== '') {
                $password = $body['password'];
                if (strlen($password) < 8) {
                    http_response_code(400);
                    return ['error' => 'Mot de passe trop court (min 8 caractères)'];
                }
                $profil['password'] = password_hash($password, PASSWORD_BCRYPT);
                $updated = true;
            }

            if (!$updated) {
                http_response_code(400);
                return ['error' => 'Aucun champ valide à mettre à jour'];
            }

            $ok = $this->repo->update($profil);
            if ($ok) {
                // rediriger si navigateur, sinon renvoyer JSON
                $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
                if (strpos($accept, 'text/html') !== false) {
                    header('Location: /');
                    http_response_code(302);
                    exit;
                }
                http_response_code(200);
                return ['success' => true, 'message' => 'Profil mis à jour'];
            }
        }

        // Connexion
        if (preg_match('#/login$#', $path)) {
            $email = trim($body['email'] ?? '');
            $password = $body['password'] ?? '';

            $profil = $this->repo->findByEmail($email);
            if (!$profil || !password_verify($password, $profil['password'])) {
                http_response_code(401);
                return ['error' => 'Identifiants invalides'];
            }

            session_regenerate_id(true);
            // stocker l'id du profil et l'email dans la session
            $_SESSION['profil_id'] = (int)$profil['id'];
            $_SESSION['email'] = $profil['email'];

            return [
                'message' => 'Connecté',
                'id' => (int)$profil['id'],
                'user' => [
                    'email' => $profil['email'],
                    'nom' => $profil['nom'] ?? '',
                    'prenom' => $profil['prenom'] ?? ''
                ]
            ];
        }

        // Déconnexion
        if (preg_match('#/logout$#', $path)) {
            session_unset();
            session_destroy();
            setcookie(session_name(), '', time() - 3600, '/');
            return ['message' => 'Déconnecté'];
        }

        http_response_code(404);
        return ['error' => 'Route non trouvée'];
    }

    public function jsonResponse($request) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        header('Content-Type: application/json; charset=utf-8');
        $method = $request->getMethod();

        if ($method === 'GET') {
            $result = $this->processGetRequest($request);
        } elseif ($method === 'POST') {
            $result = $this->processPostRequest($request);
        } else {
            http_response_code(404);
            $result = ['error' => 'Route non trouvée'];
        }
        echo json_encode($result);
    }
}
