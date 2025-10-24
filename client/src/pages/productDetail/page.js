// javascript
import { ProductData } from "../../data/product.js";
import { htmlToFragment, getStockStatus } from "../../lib/utils.js";
import { DetailView } from "../../ui/detail/index.js";
import template from "./template.html?raw";
import renderImageGalerie from '../../ui/imagegalerie/index.js';
import { cartModule } from "../../data/cart.js";

let M = {
    product: null,
    selectedOptions: {},
    selectedVariant: null
};

M.getProductById = function(id) {
    return ProductData.fetch(id).then(products => {
        M.product = (Array.isArray(products) && products.length > 0) ? products[0] : null;
        return M.product;
    });
};

M.findVariantFromSelectedOptions = function(selectedOptions) {
    if (!M.product || !M.product.variants) return null;

    const selectedValueIds = Object.values(selectedOptions).map(id => parseInt(id));

    if (selectedValueIds.length !== M.product.options.length) {
        return null;
    }

    const foundVariant = M.product.variants.find(variant => {
        const variantValueIds = variant.option_values.sort();
        const selectedIdsSorted = [...selectedValueIds].sort();

        if (variantValueIds.length !== selectedIdsSorted.length) return false;

        return variantValueIds.every((valueId, index) => valueId === selectedIdsSorted[index]);
    });

    M.selectedVariant = foundVariant || null;
    return M.selectedVariant;
};

let C = {};

C.handler_addToCart = function(ev) {
    if (!M.selectedVariant) {
        V.renderVariantError("Impossible d'ajouter au panier : variante non valide.");
        return;
    }

    if (M.selectedVariant.stock <= 0) {
        V.renderVariantError("Cette variante est épuisée.");
        return;
    }

    try {
        const optionsDescription = M.product.options.map(optType => {
            const valueId = M.selectedOptions[optType.id];
            const valueObj = optType.values.find(v => v.id == valueId);
            return `${optType.name}: ${valueObj.value}`;
        }).join(', ');

        const itemToAdd = {
            id: M.selectedVariant.id,
            productId: M.product.id,
            name: M.product.name,
            price: M.selectedVariant.price,
            image: (M.product.images && M.product.images[0]?.url) || M.product.imageUrl,
            quantity: 1,
            options: M.product.options.map(optType => ({
                type: optType.name,
                value: optType.values.find(v => v.id == M.selectedOptions[optType.id])?.value || ''
            })),
            optionsDescription: optionsDescription
        };

        cartModule.addItem(itemToAdd, 1);
        V.updateCartIndicator();

        V.showToast(`${M.product.name} (${optionsDescription}) ajouté au panier !`);

    } catch (e) {
        console.error("Erreur lors de l'ajout au panier:", e);
        V.renderVariantError("Erreur lors de l'ajout au panier.");
    }
};

C.handler_optionChange = function(ev) {
    const select = ev.target;
    const optionTypeId = select.dataset.optionTypeId;
    const optionValueId = select.value;

    if (optionValueId) {
        M.selectedOptions[optionTypeId] = optionValueId;
    } else {
        delete M.selectedOptions[optionTypeId];
    }

    const variant = M.findVariantFromSelectedOptions(M.selectedOptions);

    if (variant) {
        V.updatePrice(variant.price);
        V.updateStockStatus(variant.stock);
        V.enableAddToCart(variant.stock > 0);
        V.renderVariantError(null);
    } else {
        V.updatePrice(M.product.price);
        V.updateStockStatus(null);
        V.disableAddToCart();

        const allOptionsSelected = Object.keys(M.selectedOptions).length === M.product.options.length;
        if (allOptionsSelected) {
            V.renderVariantError("Cette combinaison d'options n'est pas disponible.");
        } else {
            V.renderVariantError(null);
        }
    }
};

C.init = async function(params) {
    try {
        const productId = params.id;
        const product = await M.getProductById(productId);

        if (!product) {
            return V.renderError("Produit non trouvé");
        }

        M.selectedOptions = {};
        M.selectedVariant = null;

        return V.init(product);
    } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
        return V.renderError("Erreur lors du chargement du produit");
    }
};

let V = {};

V.init = function(data) {
    let fragment = V.createPageFragment(data);
    V.attachEvents(fragment);
    cartModule.updateCartCounter();
    return fragment;
};

V.createPageFragment = function(data) {
    console.log("V.createPageFragment: Données reçues:", data);

    let pageFragment = htmlToFragment(template);
    let detailDOM = DetailView.dom(data);

    const detailSlot = pageFragment.querySelector('slot[name="detail"]');
    if (detailSlot) {
        detailSlot.replaceWith(detailDOM);
    } else {
        console.error("ERREUR CRITIQUE: Slot 'detail' introuvable dans productDetail/template.html");
    }

    const galerieSlot = pageFragment.querySelector('slot[name="image-galerie"]');
    if (galerieSlot && Array.isArray(data.images) && data.images.length > 0) {
        const galerieDOM = renderImageGalerie({ images: data.images });
        galerieSlot.replaceWith(galerieDOM);
    }

    const optionsContainer = pageFragment.querySelector('#product-options');
    console.log("V.createPageFragment: Conteneur #product-options trouvé DANS pageFragment ?", optionsContainer);

    if (optionsContainer && data.options && data.options.length > 0) {
        console.log("V.createPageFragment: Boucle sur les options va commencer:", data.options);

        data.options.forEach(optionType => {
            console.log("V.createPageFragment: Création du select pour l'option:", optionType.name);
            try {
                const optionWrapper = document.createElement('div');
                const label = document.createElement('label');
                label.htmlFor = `option-${optionType.id}`;
                label.className = "block text-sm font-medium text-gray-700 mb-1";
                label.textContent = optionType.name;
                const select = document.createElement('select');
                select.id = `option-${optionType.id}`;
                select.dataset.optionTypeId = optionType.id;
                select.className = "w-full border border-gray-300 p-2 rounded-md";
                const defaultOption = document.createElement('option');
                defaultOption.value = "";
                defaultOption.textContent = `Choisir ${optionType.name}...`;
                select.appendChild(defaultOption);
                optionType.values.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value.id;
                    option.textContent = value.value;
                    select.appendChild(option);
                });
                optionWrapper.appendChild(label);
                optionWrapper.appendChild(select);
                optionsContainer.appendChild(optionWrapper);

                console.log(`V.createPageFragment: Select pour ${optionType.name} ajouté au conteneur.`);
            } catch (error) {
                console.error("ERREUR lors de la création du select pour", optionType.name, error);
            }
        });
    } else {
        if (!optionsContainer) console.log("V.createPageFragment: Le conteneur #product-options est INTROUVABLE DANS pageFragment.");
        if (!data.options || data.options.length === 0) console.log("V.createPageFragment: PAS d'options ('data.options') dans les données reçues.");
    }

    console.log("V.createPageFragment: Fragment final avant retour:", pageFragment.cloneNode(true));

    return pageFragment;
};

V.attachEvents = function(pageFragment) {
    const addToCartBtn = pageFragment.querySelector('#add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', C.handler_addToCart);
    }

    const optionSelects = pageFragment.querySelectorAll('#product-options select');
    optionSelects.forEach(select => {
        select.addEventListener('change', C.handler_optionChange);
    });

    return pageFragment;
};

V.updatePrice = function(price) {
    const priceEl = document.querySelector('#product-price');
    if (priceEl) {
        priceEl.textContent = `${parseFloat(price).toFixed(2)} €`;
    }
};

V.updateStockStatus = function(stock) {
    const stockEl = document.querySelector('#variant-stock-status');
    if (!stockEl) return;

    if (stock === null || typeof stock === 'undefined') {
        stockEl.innerHTML = '';
        return;
    }

    const status = getStockStatus(stock);
    stockEl.innerHTML = `<span class="${status.class}">${status.text}</span>`;
};

V.enableAddToCart = function(inStock = true) {
    const btn = document.querySelector('#add-to-cart-btn');
    if (btn) {
        btn.disabled = !inStock;
        if (inStock) {
            btn.textContent = 'Ajouter au panier';
        } else {
            btn.textContent = 'Rupture de stock';
        }
    }
};

V.disableAddToCart = function() {
    const btn = document.querySelector('#add-to-cart-btn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sélectionnez vos options';
    }
};

V.renderVariantError = function(message) {
    const errorEl = document.querySelector('#variant-error');
    if (errorEl) {
        if (message) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        } else {
            errorEl.classList.add('hidden');
        }
    }
};

V.showToast = function(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white py-3 px-5 rounded-lg shadow-lg transform translate-y-20 opacity-0 transition-all duration-300';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

V.updateCartIndicator = function() {
    cartModule.updateCartCounter();
};

V.renderError = function(message) {
    const errorFragment = document.createDocumentFragment();
    const errorElement = document.createElement('div');
    errorElement.className = 'text-center p-8';
    errorElement.innerHTML = `
        <h2 class="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
        <p class="text-gray-700">${message}</p>
        <a href="/" data-link class="mt-6 inline-block px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">
            Retour à l'accueil
        </a>
    `;
    errorFragment.appendChild(errorElement);
    return errorFragment;
};

export function ProductDetailPage(params) {
    return C.init(params);
}
