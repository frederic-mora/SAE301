// javascript
import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { cartModule } from "../../data/cart.js";
import { ProductData } from "../../data/product.js";

let DetailView = {
  html: function (data) {
    return genericRenderer(template, data);
  },

  dom: function (data) {
    return htmlToFragment(DetailView.html(data));
  }
};

async function addToCartFromButton(btn) {
  const productId = btn.dataset.buy;

  let product = null;

  // Essayer via ProductData.fetchById
  try {
    if (ProductData && typeof ProductData.fetchById === 'function') {
      product = await ProductData.fetchById(productId);
    }
  } catch (err) {
    console.warn('[detail] ProductData.fetchById failed:', err);
  }

  // Fallback : reconstruire depuis le DOM si nécessaire
  if (!product) {
    const article = btn.closest('article') || btn.closest('section') || document;
    const name = article.querySelector('h1')?.textContent?.trim() || `product-${productId}`;
    const priceText = article.querySelector('.mb-1')?.textContent || article.querySelector('[data-price]')?.textContent || '';
    const price = parseFloat(priceText.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
    const image = article.querySelector('img')?.src || '';
    product = { id: productId, name, price, image };
  }

  try {
    const result = cartModule.addItem(product, 1); // quantité forcée à 1
    try { window.alert('Produit ajouté au panier'); } catch(e) { /* silent */ }
  } catch (err) {
    console.error('[detail] addToCart error ->', err);
  }
}

function initBuyHandler(root = document) {
  if (initBuyHandler._attached) return;
  initBuyHandler._attached = true;

  root.addEventListener('click', async (ev) => {
    const btn = ev.target.closest('[data-buy]');
    if (!btn) return;
    ev.preventDefault();
    await addToCartFromButton(btn);
  });
}

// Auto-init si souhaité
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initBuyHandler());
} else {
  initBuyHandler();
}

export { DetailView, initBuyHandler };
