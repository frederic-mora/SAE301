import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { BasketData } from "../../data/basket.js";
import { ToastManager } from "../../lib/toast.js";
import { ProductData } from "../../data/product.js";

let ProductView = {
  html: function (data) {
    let htmlString = '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">';
    for (let obj of data) {
      htmlString  += genericRenderer(template, obj);
    }
    return htmlString + '</div>';
  },

  dom: function (data) {
    const fragment = htmlToFragment( ProductView.html(data) );
    
    // Ajouter les event listeners pour les boutons "Ajouter"
    const addToCartButtons = fragment.querySelectorAll('[data-buy]');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', async function(e) {
        e.preventDefault();
        const productId = parseInt(this.getAttribute('data-buy'));
        
        try {
          // Récupérer le produit complet depuis l'API
          const fullProduct = await ProductData.fetch(productId);
          
          if (fullProduct && fullProduct.length > 0) {
            const product = fullProduct[0];
            
            // Ajouter au panier
            BasketData.addItem(product, 1);
            
            // Toast de succès
            ToastManager.success(`${product.name} ajouté au panier ✓`);
          } else {
            ToastManager.error('Produit non trouvé');
          }
        } catch (error) {
          console.error('Erreur lors de l\'ajout au panier:', error);
          ToastManager.error('Erreur lors de l\'ajout au panier');
        }
      });
    });
    
    return fragment;
  }

};

export { ProductView };
