
import { Router } from "./lib/router.js";
import { AboutPage } from "./page/about-page.js";
import { HomePage } from "./page/home-page.js";
import { ProductPage } from "./page/product-page.js";
import { The404Page } from "./page/error-page.js";

// Exemple d'utilisation avec authentification
const router = new Router();

// Routes publiques
router.addRoute('/', HomePage);

// Route pour afficher les produits
router.addRoute('/products', ProductPage);
  
// Route A propos
router.addRoute('/about', AboutPage);

// Route 404
router.addRoute('*', The404Page);

// Démarrer le routeur
router.start();