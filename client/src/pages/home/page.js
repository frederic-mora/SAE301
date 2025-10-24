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
    
    // Récupérer les produits - essayer catégorie 2 (Fall/Winter), sinon tous les produits
    let products = [];
    try {
        products = await ProductData.fetchByCategory(2); // Fall/Winter collection
    } catch (error) {
        console.warn('Erreur récupération catégorie 2, utilisation de tous les produits:', error);
        products = await ProductData.fetchAll();
    }
    
    return V.init(userData, isAuthenticated, products);
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
    
    // Afficher les produits de la catégorie 2 (sans filtrer par collection pour le moment)
    console.log('Produits reçus:', products);
    
    // Remplir les produits avec les vraies données de la BDD
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
                const linkEl = productElement.querySelector('a[data-link]');
                
                if (nameEl) nameEl.textContent = product.name || 'Produit';
                if (priceEl) priceEl.textContent = `€${parseFloat(product.price || 0).toFixed(2)}`;
                
                // Utiliser l'image de la BDD avec le bon chemin
                if (imageEl && product.image) {
                    // Construire le chemin de l'image selon la structure
                    const imagePath = `../../../public/productsImage/${product.image}.jpg`;
                    imageEl.src = imagePath;
                    imageEl.alt = product.name || 'Produit';
                }
                
                // Mettre à jour les liens vers les détails produit
                if (linkEl) {
                    linkEl.href = `/products/${product.id}/${product.image}`;
                }
            }
        });
    } else {
        console.warn('Aucun produit trouvé pour la catégorie 2');
    }
    
    return fragment;
};

export function HomePage() {
    return C.init();
}
