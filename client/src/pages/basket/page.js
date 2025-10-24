import { htmlToFragment } from "../../lib/utils.js";
import { BasketData } from "../../data/basket.js";
import { OrderData } from "../../data/order.js";
import { LoginData } from "../../data/login.js";
import { ToastManager } from "../../lib/toast.js";
import template from "./template.html?raw";

export const page = {
  /**
   * Retourne le template HTML brut de la page panier
   * @returns {string} Le template HTML
   */
  html() {
    return template;
  },

  /**
   * Retourne un fragment DOM de la page panier avec les événements attachés
   * @returns {DocumentFragment} Le fragment de la page
   */
  dom() {
    const fragment = htmlToFragment(template);
    this.attachEvents(fragment);
    this.render(fragment);
    return fragment;
  },

  /**
   * Remplit le panier avec les produits du localStorage
   * @param {DocumentFragment|Element} container - Le fragment ou l'élément du panier
   */
  render(container) {
    const basket = BasketData.getBasket();
    const itemsContainer = container.querySelector('[data-basket-items]');
    
    if (!itemsContainer) return;

    if (basket.length === 0) {
      itemsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center py-16">
          <p class="text-lg uppercase tracking-widest font-medium text-gray-600 mb-4">Le panier est vide</p>
          <button id="emptyBasketBtn" type="button" class="border border-black px-6 py-3 uppercase tracking-widest font-black text-sm hover:bg-gray-50 transition-colors">
            Découvrez nos produits
          </button>
        </div>
      `;
      
      // Attacher le listener au bouton
      const emptyBasketBtn = itemsContainer.querySelector('#emptyBasketBtn');
      if (emptyBasketBtn) {
        emptyBasketBtn.addEventListener('click', () => {
          if (window.router) {
            window.router.navigate('/products');
          } else {
            window.location.href = '/products';
          }
        });
      }
    } else {
      itemsContainer.innerHTML = basket.map((item) => `
        <div class="border border-gray-200 p-4 flex gap-4" data-basket-item="${item.id}">
          <!-- Image -->
          <div class="flex-shrink-0">
            <div class="w-24 h-24 bg-gray-200">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e5e5' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='10' text-anchor='middle' dy='.3em' fill='%23999'%3EImage%3C/text%3E%3C/svg%3E" alt="${item.name}" class="w-full h-full object-cover" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            </div>
          </div>

          <!-- Infos produit -->
          <div class="flex-1">
            <p class="text-xs uppercase tracking-widest font-medium text-gray-600">${item.statut || item.status || 'Produit'}</p>
            <p class="text-xs uppercase tracking-widest font-medium text-gray-600 mb-2">${item.collection || 'Collection'}</p>
            <p class="font-black text-lg mb-2">${item.name}</p>
            <p class="text-sm font-black mb-4">${(parseFloat(item.price) || 0).toFixed(2)} €</p>

            <!-- Quantité -->
            <div class="flex items-center gap-3 mb-4">
              <button type="button" class="w-8 h-8 border border-gray-300 text-xs decreaseQty flex items-center justify-center hover:bg-gray-100" data-product-id="${item.id}">−</button>
              <span class="w-8 text-center text-sm font-medium" data-quantity>${item.quantity}</span>
              <button type="button" class="w-8 h-8 border border-gray-300 text-xs increaseQty flex items-center justify-center hover:bg-gray-100" data-product-id="${item.id}">+</button>
            </div>

            <!-- Actions -->
            <div class="flex gap-4">
              <span class="text-xs uppercase tracking-widest font-medium">Sous-total: <span class="font-black">${(parseFloat(item.price) * item.quantity).toFixed(2)} €</span></span>
              <button type="button" class="text-xs text-red-600 uppercase tracking-widest font-medium removeItem hover:underline" data-product-id="${item.id}">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }

    this.updateTotal(container);
    this.attachItemEvents(container);
  },

  /**
   * Attache les événements aux articles du panier
   * @param {Element} container - Le conteneur principal du panier
   */
  attachItemEvents(container) {
    const itemsContainer = container.querySelector('[data-basket-items]');
    if (!itemsContainer) return;

    const self = this;

    // Ajouter les listeners aux boutons
    const increaseButtons = itemsContainer.querySelectorAll('.increaseQty');
    const decreaseButtons = itemsContainer.querySelectorAll('.decreaseQty');
    const removeButtons = itemsContainer.querySelectorAll('.removeItem');

    increaseButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = parseInt(btn.dataset.productId);
        const basket = BasketData.getBasket();
        const item = basket.find(i => i.id === productId);
        if (item) {
          item.quantity = Math.max(1, parseInt(item.quantity) || 1) + 1;
          BasketData.saveBasket(basket);
          
          // Mettre à jour le sous-total de l'article
          const itemElement = container.querySelector(`[data-basket-item="${productId}"]`);
          if (itemElement) {
            itemElement.querySelector('[data-quantity]').textContent = item.quantity;
            const priceElement = itemElement.querySelector('.font-black');
            const itemPrice = parseFloat(priceElement.textContent);
            const subTotalSpan = itemElement.querySelector('.font-black:last-of-type');
            if (subTotalSpan) {
              subTotalSpan.textContent = (itemPrice * item.quantity).toFixed(2) + ' €';
            }
          }
          
          // Mettre à jour le récapitulatif
          self.updateTotal(container);
        }
      });
    });

    decreaseButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = parseInt(btn.dataset.productId);
        const basket = BasketData.getBasket();
        const item = basket.find(i => i.id === productId);
        if (item) {
          const newQuantity = Math.max(1, parseInt(item.quantity) || 1) - 1;
          if (newQuantity > 0) {
            item.quantity = newQuantity;
            BasketData.saveBasket(basket);
            
            // Mettre à jour le sous-total de l'article
            const itemElement = container.querySelector(`[data-basket-item="${productId}"]`);
            if (itemElement) {
              itemElement.querySelector('[data-quantity]').textContent = item.quantity;
              const priceElement = itemElement.querySelector('.font-black');
              const itemPrice = parseFloat(priceElement.textContent);
              const subTotalSpan = itemElement.querySelector('.font-black:last-of-type');
              if (subTotalSpan) {
                subTotalSpan.textContent = (itemPrice * item.quantity).toFixed(2) + ' €';
              }
            }
            
            // Mettre à jour le récapitulatif
            self.updateTotal(container);
          } else {
            BasketData.removeItem(productId);
            self.render(container);
          }
        }
      });
    });

    removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = parseInt(btn.dataset.productId);
        BasketData.removeItem(productId);
        self.render(container);
      });
    });
  },

  /**
   * Met à jour le total du panier
   * @param {Element|DocumentFragment} container - Le conteneur
   */
  updateTotal(container) {
    const subtotalEl = container.querySelector('#basketSubtotal');
    const totalEl = container.querySelector('#basketTotal');
    
    if (subtotalEl || totalEl) {
      const total = BasketData.getTotal();
      const totalFormatted = total.toFixed(2).replace('.', ',') + ' €';
      
      if (subtotalEl) {
        subtotalEl.textContent = totalFormatted;
      }
      if (totalEl) {
        totalEl.textContent = totalFormatted;
      }
    }
  },

  /**
   * Attache les événements généraux de la page
   * @param {DocumentFragment} fragment - Le fragment du panier
   */
  attachEvents(fragment) {
    const checkoutBtn = fragment.querySelector('#checkoutBtn');
    const continueShoppingBtn = fragment.querySelector('#continueShopping');

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.handleCheckout(fragment));
    }
    
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener('click', () => {
        if (window.router) {
          window.router.navigate('/products');
        } else {
          window.location.href = '/products';
        }
      });
    }
  },

  /**
   * Gère le checkout du panier
   */
  handleCheckout: async function(container) {
    const basket = BasketData.getBasket();
    
    if (basket.length === 0) {
      ToastManager.warning('Le panier est vide');
      return;
    }

    const user = LoginData.getCurrentUser();
    if (!user) {
      ToastManager.error('Vous devez être connecté pour commander');
      window.location.href = '/login';
      return;
    }

    // Afficher un loader ou bloquer le bouton
    const checkoutBtn = container.querySelector('#checkoutBtn');
    const originalText = checkoutBtn.textContent;
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Traitement...';

    try {
      const result = await OrderData.createOrderFromBasket(user.id, basket);
      
      if (result && result.success) {
        console.log('Commande créée avec succès:', result.order);
        
        // Vider le panier
        BasketData.clearBasket();
        
        // Afficher un message de succès
        ToastManager.success('Commande créée avec succès!');
        
        // Rediriger vers le profil pour voir les commandes
        if (window.router) {
          window.router.navigate('/profile');
        } else {
          window.location.href = '/profile';
        }
      } else {
        ToastManager.error('Erreur lors de la création de la commande: ' + (result?.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur lors du checkout:', error);
      ToastManager.error('Une erreur s\'est produite lors de la création de la commande');
    } finally {
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = originalText;
    }
  }
};

/**
 * Handler pour la route /basket
 * Retourne le fragment DOM de la page panier
 */
export function BasketPageHandler() {
  return page.dom();
}
