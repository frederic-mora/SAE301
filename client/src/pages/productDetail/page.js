// javascript
import { ProductData } from "../../data/product.js";
import { htmlToFragment } from "../../lib/utils.js";
import { DetailView } from "../../ui/detail/index.js";
import template from "./template.html?raw";
import renderImageGalerie from '../../ui/imagegalerie/index.js';

// Modèle
let M = {
    products: [],
    cart: JSON.parse(localStorage.getItem('cart') || '[]')
};

M.getProductById = function(id) {
    return M.products.find(product => product.id == id);
};

M.addToCart = function(productId, quantity = 1) {
    const product = M.getProductById(productId);
    if (!product) return false;

    const existingItemIndex = M.cart.findIndex(item => item.id == productId);

    if (existingItemIndex >= 0) {
        M.cart[existingItemIndex].quantity += quantity;
    } else {
        M.cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity
        });
    }

    // Persistance du panier
    localStorage.setItem('cart', JSON.stringify(M.cart));
    return true;
};

M.updateCartItemQuantity = function(productId, quantity) {
    const itemIndex = M.cart.findIndex(item => item.id == productId);
    if (itemIndex < 0) return false;

    if (quantity <= 0) {
        M.cart.splice(itemIndex, 1);
    } else {
        M.cart[itemIndex].quantity = quantity;
    }

    localStorage.setItem('cart', JSON.stringify(M.cart));
    return true;
};

M.removeFromCart = function(productId) {
    const itemIndex = M.cart.findIndex(item => item.id == productId);
    if (itemIndex < 0) return false;

    M.cart.splice(itemIndex, 1);
    localStorage.setItem('cart', JSON.stringify(M.cart));
    return true;
};

M.getCartCount = function() {
    return M.cart.reduce((sum, item) => sum + item.quantity, 0);
};

M.getCartTotal = function() {
    return M.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// Contrôleur
let C = {};

C.handler_addToCart = function(ev) {
    if (ev.target.dataset.buy !== undefined) {
        const id = ev.target.dataset.buy;
        const quantity = 1; // Toujours 1 unité par clic (suppression de la logique quantité sur la page détail)

        if (M.addToCart(id, quantity)) {
            // Mise à jour visuelle
            V.updateCartIndicator();

            // Feedback utilisateur
            const toast = document.createElement('div');
            toast.className = 'toast success';
            toast.textContent = `${quantity} produit(s) ajouté(s) au panier !`;
            document.body.appendChild(toast);

            // Suppression après animation
            setTimeout(() => {
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                }, 2000);
            }, 10);
        }
    }
};

// NOTE: handler_quantityChange supprimé (plus de contrôle de quantité sur la page détail)

C.init = async function(params) {
    try {
        // Récupérer l'ID depuis les paramètres de route
        const productId = params.id;

        // Charger les produits depuis l'API
        M.products = await ProductData.fetchAll();

        // Récupérer le produit spécifique
        let product = M.getProductById(productId);

        if (!product) {
            return V.renderError("Produit non trouvé");
        }

        // Initialiser la vue avec les données du produit
        return V.init(product);
    } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
        return V.renderError("Erreur lors du chargement du produit");
    }
};

// Vue
let V = {};

V.init = function(data) {
    let fragment = V.createPageFragment(data);
    V.attachEvents(fragment);
    V.updateCartIndicator();
    return fragment;
};

V.createPageFragment = function(data) {
    // Créer le fragment depuis le template
    let pageFragment = htmlToFragment(template);

    // Générer le composant detail
    let detailDOM = DetailView.dom(data);

    // Remplacer le slot par le composant detail
    pageFragment.querySelector('slot[name="detail"]').replaceWith(detailDOM);

    // Ajouter la galerie d'images
    const galerieSlot = pageFragment.querySelector('slot[name="image-galerie"]');
    if (galerieSlot && Array.isArray(data.images) && data.images.length > 0) {
        const galerieDOM = renderImageGalerie({ images: data.images });
        galerieSlot.replaceWith(galerieDOM);
    }

    // Ne pas ajouter de sélecteur de quantité sur la page détail (suppression demandée)

    return pageFragment;
};

V.attachEvents = function(pageFragment) {
    // Attacher l'event listener au bouton d'ajout au panier
    const addToCartBtn = pageFragment.querySelector('[data-buy]');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', C.handler_addToCart);
    }

    // Plus d'écouteurs pour les boutons de quantité (supprimés)

    return pageFragment;
};

V.updateCartIndicator = function() {
    // Mettre à jour l'indicateur du panier dans la navbar
    const cartIndicator = document.querySelector('.cart-count');
    if (cartIndicator) {
        cartIndicator.textContent = M.getCartCount();
        cartIndicator.classList.toggle('hidden', M.getCartCount() === 0);
    }
};

V.renderError = function(message) {
    const errorFragment = document.createDocumentFragment();
    const errorElement = document.createElement('div');
    errorElement.className = 'error-container';
    errorElement.innerHTML = `
        <h2>Erreur</h2>
        <p>${message}</p>
        <a href="/" class="btn">Retourner à l'accueil</a>
    `;
    errorFragment.appendChild(errorElement);
    return errorFragment;
};

export function ProductDetailPage(params) {
    return C.init(params);
}
