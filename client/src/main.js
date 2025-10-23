

import { Router } from "./lib/router.js";
import { HomePage } from "./pages/home/page.js";
import { ProductsPage } from "./pages/products/page.js";
import { ProductDetailPage } from "./pages/productDetail/page.js";
import { CategoriesPage } from "./pages/categories/page.js";
import { LoginPage } from "./pages/login/page.js";
import { RegisterPage } from "./pages/register/page.js";
import {AccountPage} from "./pages/account/page.js";
import { CartPage } from "./pages/cart/page.js";

import { RootLayout } from "./layouts/root/layout.js";
import { The404Page } from "./pages/404/page.js";


const router = new Router('app');

router.addLayout("/", RootLayout);

router.addRoute("/", HomePage);

router.addRoute("/products", ProductsPage);
router.addRoute("/products/:id/:slug", ProductDetailPage);

router.addRoute("/categories/:name", CategoriesPage);


router.addRoute("/auth", LoginPage);
router.addRoute("/auth/login", LoginPage);
router.addRoute("/auth/register", RegisterPage);
router.addRoute("/dashboard/profile", AccountPage);

router.addRoute("/cart", CartPage);

router.addRoute("*", The404Page);

// Démarrer le routeur
router.start();