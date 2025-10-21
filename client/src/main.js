
import { Router } from "./lib/router.js";
import { AboutPage } from "./pages/about/page.js";
import { HomePage } from "./pages/home/page.js";
import { ProductsPage } from "./pages/products/page.js";
import { ProductDetailPage } from "./pages/productDetail/page.js";
import { ProductsCategoryPage } from "./pages/productsCategory/page.js";
import { RootLayout } from "./layouts/root/layout.js";
import { The404Page } from "./pages/404/page.js";
import { LoginPage } from "./pages/login/page.js";
import { SignupsPage } from "./pages/signup/page.js";
import { ProfilePage } from "./pages/profile/page.js";
import { SuccessPage } from "./pages/success/page.js";

// Exemple d'utilisation avec authentification

const router = new Router('app', { loginPath: '/login' });

router.addLayout("/", RootLayout);

router.addRoute("/", HomePage);
router.addRoute("/about", AboutPage);

router.addRoute("/products", ProductsPage);
router.addRoute("/products/:id/:slug", ProductDetailPage);
router.addRoute("/category/:id/:category", ProductsCategoryPage);

router.addRoute("/login", LoginPage);
router.addRoute("/signup", SignupsPage);
router.addRoute("/profile", ProfilePage, { requireAuth: true });
router.addRoute("/success", SuccessPage);

router.addRoute("*", The404Page);

// Démarrer le routeur
router.start();

