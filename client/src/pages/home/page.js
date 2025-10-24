import { htmlToFragment } from "../../lib/utils.js";
import { ProductData } from "../../data/product.js";
import template from "./template.html?raw";

let M = {
    products: []
};
let C = {};
let V = {};

C.init = async function() {
    // Récupérer les données utilisateur depuis sessionStorage
    const userJson = sessionStorage.getItem('user');
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    
    let userData = null;
    if (isAuthenticated && userJson) {
        try {
            userData = JSON.parse(userJson);
        } catch (error) {
            console.error('Erreur parsing user:', error);
        }
    }
    
    // Récupérer les produits de la collection "fall/winter 2025 collection"
    // ID de la catégorie à adapter selon votre base de données
    M.products = await ProductData.fetchByCategory(2); // À adapter selon l'ID réel
    
    return V.init(userData, isAuthenticated, M.products);
};

V.init = function(userData, isAuthenticated, products) {
    const fragment = htmlToFragment(template);
    
    // Remplir les données utilisateur
    if (isAuthenticated && userData) {
        const welcomeElement = fragment.querySelector('[data-user-name]');
        if (welcomeElement) {
            welcomeElement.textContent = userData.name || userData.surname || 'Bienvenue';
        }
        
        const userEmailElement = fragment.querySelector('[data-user-email]');
        if (userEmailElement) {
            userEmailElement.textContent = userData.email || '';
        }
        
        const userFullNameElement = fragment.querySelector('[data-user-fullname]');
        if (userFullNameElement) {
            const fullName = `${userData.name || ''} ${userData.surname || ''}`.trim();
            userFullNameElement.textContent = fullName || 'Utilisateur';
        }
    } else {
        // Masquer les éléments personnalisés si non authentifié
        const authSection = fragment.querySelector('[data-auth-section]');
        if (authSection) {
            authSection.style.display = 'none';
        }
    }
    
    // Remplir les produits
    const productsContainer = fragment.querySelector('[data-products-container]');
    if (productsContainer && products && products.length > 0) {
        // Limiter à 3 produits maximum
        const limitedProducts = products.slice(0, 3);
        
        limitedProducts.forEach((product, index) => {
            const productElement = fragment.querySelector(`[data-product-${index}]`);
            if (productElement) {
                // Remplir les données du produit
                const nameEl = productElement.querySelector('[data-product-name]');
                const priceEl = productElement.querySelector('[data-product-price]');
                const imageEl = productElement.querySelector('[data-product-image]');
                
                if (nameEl) nameEl.textContent = product.name || 'Produit';
                if (priceEl) priceEl.textContent = `€${product.price || '0'}`;
                if (imageEl && product.image) {
                    imageEl.src = product.image;
                    imageEl.alt = product.name;
                }
            }
        });
    }
    
    return fragment;
};

export function HomePage() {
    return C.init();
}
