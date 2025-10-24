import { ProductData } from "../../data/product.js";
import { ProductView } from "../../ui/product/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { HeaderView } from "../../ui/header/index.js";
import { BasketData } from "../../data/basket.js";
import { BasketView } from "../../ui/basket/index.js";
import { ToastManager } from "../../lib/toast.js";


let M = {
    products: []
};
let V = {};
M.getProductAmount = async function(categoryId){
    M.products = await ProductData.fetchProductsAmount(categoryId);
}
V.renderAmount=function(data){
    let counter = document.querySelector('#counter');
    if (counter) {
        counter.textContent = `${data.length} PRODUITS`;
    }
}

M.productsByCategory = async function(categoryId){
    if (categoryId === 1){
        M.products = await ProductData.fetchAll();
    } else {
        M.products = await ProductData.fetchByCategory(categoryId);
    }
    return M.products;
}



let C = {};

C.handler_addToBasket = function(ev){
    if (ev.target.dataset.addToBasket !== undefined){
        let productId = parseInt(ev.target.dataset.addToBasket);
        
        // Trouver le produit dans la liste
        let product = M.products.find(p => p.id === productId);
        
        if (product) {
            // Ajouter au panier localStorage - BasketData.addItem() appelle notifyObservers()
            BasketData.addItem({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price) || 0,
                image: product.image || '',
                collection: product.collection || 'Collection',
                statut: product.statut || product.status || 'Produit'
            }, 1);
            
            // Feedback utilisateur
            ToastManager.success(`${product.name} ajouté au panier !`);
        }
    }
}

/**
 * Trie les produits par prix
 * @param {Array} products - La liste des produits
 * @param {string} sortType - 'asc' pour croissant, 'desc' pour décroissant
 * @returns {Array} Les produits triés
 */
C.sortProductsByPrice = function(products, sortType) {
    if (!products || products.length === 0) return products;
    
    const sorted = [...products];
    
    if (sortType === 'asc') {
        // Croissant (du moins cher au plus cher)
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortType === 'desc') {
        // Décroissant (du plus cher au moins cher)
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    
    return sorted;
}

/**
 * Gère le changement du tri par prix
 */
C.handler_sortByPrice = function(ev) {
    const sortType = ev.target.value;
    
    // Trier les produits
    const sortedProducts = C.sortProductsByPrice(M.products, sortType);
    
    // Re-rendre la page avec les produits triés
    const root = document.querySelector('[data-products-container]');
    if (root) {
        const productsDOM = ProductView.dom(sortedProducts);
        const productsSlot = root.querySelector('slot[name="products"]') || root.querySelector('[data-products-slot]');
        
        if (productsSlot) {
            productsSlot.replaceWith(productsDOM);
        } else {
            // Si pas de slot trouvé, remplacer le dernier enfant
            const lastChild = root.lastElementChild;
            if (lastChild) {
                lastChild.replaceWith(productsDOM);
            }
        }
        
        // Mettre à jour le compteur
        V.renderAmount(sortedProducts);
        
        // Réattacher les événements
        V.attachEvents(root);
    }
}

C.handler_clickOnProduct = function(ev){
    if (ev.target.dataset.buy!==undefined){
        let id = ev.target.dataset.buy;
        ToastManager.info(`Produit ${id} - Excellent choix !`);
    }
}
// C.handler_clickOnCategory = async function(ev){
//     console.log("Category ID:", id);
//     if (ev.target.dataset.category !== undefined){
//         let id = ev.target.dataset.id;
        
//         const products = await M.productsByCategory(id);
//         const root = document.querySelector('#app');
//         const newContent = await V.renderCat(products);
//         root.replaceChildren(newContent);
//     }
// }

C.init = async function(){
    M.products = await ProductData.fetchAll(); 
    return V.init( M.products );
}




V.init = function(data){
    let fragment = V.createPageFragment(data);
    V.attachEvents(fragment);
    V.renderAmount(data);
    return fragment;
}
// V.renderCat = async function(data){
    
    
//     let newFragment = V.createPageFragment(data);
//     V.attachEvents(newFragment);
//     return newFragment;

// }

V.createPageFragment = function( data ){
   // Créer le fragment depuis le template
   let pageFragment = htmlToFragment(template);
   
   // Ajouter un identifiant au conteneur principal
   const mainDiv = pageFragment.querySelector('.font-sans');
   if (mainDiv) {
       mainDiv.setAttribute('data-products-container', '');
   }
   
   // Générer les produits
   let productsDOM = ProductView.dom(data);
   
   // Remplacer le slot par les produits
   pageFragment.querySelector('slot[name="products"]').replaceWith(productsDOM);
   
   return pageFragment;
}

V.attachEvents = function(pageFragment) {
    let root = pageFragment.firstElementChild || pageFragment;
    
    // Handler pour ajouter au panier avec event delegation
    root.addEventListener("click", (ev) => {
        if (ev.target.dataset.addToBasket !== undefined) {
            C.handler_addToBasket(ev);
        }
    });
    
    root.addEventListener("click", C.handler_clickOnProduct);
    root.addEventListener("click", C.handler_clickOnCategory);
    
    // Ajouter l'écouteur pour le tri par prix
    const sortSelect = root.querySelector('#sortByPrice');
    if (sortSelect) {
        sortSelect.addEventListener('change', C.handler_sortByPrice);
    }
    
    // S'inscrire comme observateur pour mettre à jour le badge du panier
    BasketData.subscribe(() => {
        BasketView.updateBadge();
    });
    
    let header = HeaderView.dom();
    header.addEventListener("click", C.handler_clickOnCategory);
    return pageFragment;
}

export function ProductsPage(params) {
    console.log("ProductsPage", params);
    return C.init(params);
}



