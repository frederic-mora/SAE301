// javascript
import { ProductData } from "../../data/product.js";
import { htmlToFragment } from "../../lib/utils.js";
import { DetailView } from "../../ui/detail/index.js";
import template from "./template.html?raw";
import renderImageGalerie from '../../ui/imagegalerie/index.js';
// --- AJOUT US008 ---
import { cartModule } from "../../data/cart.js";
// --- FIN AJOUT US008 ---

// Modèle
let M = {
    product: null, // Contient le produit complet avec options et variantes
    selectedOptions: {}, // Stocke les { optionTypeId: optionValueId }
    selectedVariant: null // Stocke la variante valide trouvée
};

M.getProductById = function(id) {
    // Note: M.products est remplacé par M.product
    // Cette fonction est appelée par C.init pour charger UN produit
    return ProductData.fetch(id).then(products => {
        // ProductData.fetch(id) retourne un tableau, on prend le premier
        M.product = (Array.isArray(products) && products.length > 0) ? products[0] : null;
        return M.product;
    });
};

// --- NOUVELLE FONCTION US008 ---
/**
 * Trouve une variante correspond aux options sélectionnées
 * @param {object} selectedOptions - ex: { '1': '3', '2': '5' } (typeId: valueId)
 * @returns {object|null} La variante trouvée ou null
 */
M.findVariantFromSelectedOptions = function(selectedOptions) {
    if (!M.product || !M.product.variants) return null;

    const selectedValueIds = Object.values(selectedOptions).map(id => parseInt(id));

    // Si toutes les options ne sont pas sélectionnées, on ne trouve pas de variante
    if (selectedValueIds.length !== M.product.options.length) {
        return null;
    }

    const foundVariant = M.product.variants.find(variant => {
        // Compare les IDs de valeur de la variante avec les IDs sélectionnés
        const variantValueIds = variant.option_values.sort();
        const selectedIdsSorted = [...selectedValueIds].sort();

        if (variantValueIds.length !== selectedIdsSorted.length) return false;

        return variantValueIds.every((valueId, index) => valueId === selectedIdsSorted[index]);
    });

    M.selectedVariant = foundVariant || null;
    return M.selectedVariant;
};
// --- FIN NOUVELLE FONCTION US008 ---


// Contrôleur
let C = {};

// --- MODIFIÉ US008 ---
C.handler_addToCart = function(ev) {
    if (!M.selectedVariant) {
        V.renderVariantError("Impossible d'ajouter au panier : variante non valide.");
        return;
    }

    try {
        // On crée un objet "item" qui contient les infos de la variante
        // ET les infos du produit de base pour l'affichage

        // Crée une description textuelle des options
        const optionsDescription = M.product.options.map(optType => {
            const valueId = M.selectedOptions[optType.id];
            const valueObj = optType.values.find(v => v.id == valueId);
            return `${optType.name}: ${valueObj.value}`;
        }).join(', ');

        const itemToAdd = {
            id: M.selectedVariant.id, // ID de la VARIANTE
            productId: M.product.id, // ID du produit parent
            name: M.product.name,
            price: M.selectedVariant.price,
            image: (M.product.images && M.product.images[0]?.url) || M.product.imageUrl,
            quantity: 1,
            options: M.product.options.map(optType => ({
                type: optType.name,
                value: optType.values.find(v => v.id == M.selectedOptions[optType.id])?.value || ''
            })),
            optionsDescription: optionsDescription // Ajout pour la commande
        };

        cartModule.addItem(itemToAdd, 1);
        V.updateCartIndicator(); // (Utilise cartModule.updateCartCounter)

        // Feedback utilisateur
        V.showToast(`${M.product.name} (${optionsDescription}) ajouté au panier !`);

    } catch (e) {
        console.error("Erreur lors de l'ajout au panier:", e);
        V.renderVariantError("Erreur lors de l'ajout au panier.");
    }
};
// --- FIN MODIFICATION US008 ---


// --- NOUVELLE FONCTION US008 ---
/**
 * Gère le changement d'une option (clic sur <select>)
 */
C.handler_optionChange = function(ev) {
    const select = ev.target;
    const optionTypeId = select.dataset.optionTypeId;
    const optionValueId = select.value;

    // 1. Mettre à jour le modèle
    if (optionValueId) {
        M.selectedOptions[optionTypeId] = optionValueId;
    } else {
        delete M.selectedOptions[optionTypeId];
    }

    // 2. Chercher la variante correspondante
    const variant = M.findVariantFromSelectedOptions(M.selectedOptions);

    // 3. Mettre à jour la Vue
    if (variant) {
        V.updatePrice(variant.price);
        V.enableAddToCart(variant.stock > 0);
        if (variant.stock <= 0) {
            V.renderVariantError("Cette combinaison est en rupture de stock.");
        } else {
            V.renderVariantError(null); // Cache l'erreur
        }
    } else {
        // Pas de variante trouvée (soit sélection incomplète, soit combinaison invalide)
        V.updatePrice(M.product.price); // Remet le prix de base
        V.disableAddToCart();

        // Affiche une erreur seulement si toutes les options sont sélectionnées
        const allOptionsSelected = Object.keys(M.selectedOptions).length === M.product.options.length;
        if (allOptionsSelected) {
            V.renderVariantError("Cette combinaison d'options n'est pas disponible.");
        } else {
            V.renderVariantError(null); // Cache l'erreur
        }
    }
};
// --- FIN NOUVELLE FONCTION US008 ---


C.init = async function(params) {
    try {
        const productId = params.id;
        const product = await M.getProductById(productId); // Charge M.product

        if (!product) {
            return V.renderError("Produit non trouvé");
        }

        // Initialiser les options sélectionnées (par défaut: aucune)
        M.selectedOptions = {};
        M.selectedVariant = null;

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
    cartModule.updateCartCounter(); // Met à jour le compteur au chargement
    return fragment;
};

// Dans client/src/pages/productDetail/page.js

V.createPageFragment = function(data) {
    console.log("V.createPageFragment: Données reçues:", data); // LOG 1

    let pageFragment = htmlToFragment(template); // Crée le fragment de la page (productDetail/template.html)
    let detailDOM = DetailView.dom(data); // Crée le fragment du détail (detail/template.html)

    // --- CORRECTION : Chercher le slot DANS pageFragment ---
    const detailSlot = pageFragment.querySelector('slot[name="detail"]');
    if (detailSlot) {
        // Remplace le slot par le contenu de detailDOM
        detailSlot.replaceWith(detailDOM);
    } else {
        console.error("ERREUR CRITIQUE: Slot 'detail' introuvable dans productDetail/template.html");
        // On pourrait ajouter detailDOM à la fin si le slot manque, mais c'est mieux de corriger le template principal.
        // pageFragment.appendChild(detailDOM); // Fallback
    }

    // --- CORRECTION : Chercher le conteneur et la galerie DANS pageFragment APRÈS insertion ---
    const galerieSlot = pageFragment.querySelector('slot[name="image-galerie"]'); // Cherche DANS pageFragment
    if (galerieSlot && Array.isArray(data.images) && data.images.length > 0) {
        const galerieDOM = renderImageGalerie({ images: data.images });
        galerieSlot.replaceWith(galerieDOM);
    }

    const optionsContainer = pageFragment.querySelector('#product-options'); // Cherche DANS pageFragment
    console.log("V.createPageFragment: Conteneur #product-options trouvé DANS pageFragment ?", optionsContainer); // LOG 2 (modifié)

    if (optionsContainer && data.options && data.options.length > 0) {
        console.log("V.createPageFragment: Boucle sur les options va commencer:", data.options); // LOG 3

        data.options.forEach(optionType => {
            console.log("V.createPageFragment: Création du select pour l'option:", optionType.name); // LOG 4
            try {
                // ... (la logique de création des <select> reste EXACTEMENT LA MÊME qu'avant) ...
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
                // ... (fin de la logique de création des <select>) ...

                console.log(`V.createPageFragment: Select pour ${optionType.name} ajouté au conteneur.`); // LOG 5
            } catch (error) {
                console.error("ERREUR lors de la création du select pour", optionType.name, error); // LOG 6
            }
        });
    } else {
        if (!optionsContainer) console.log("V.createPageFragment: Le conteneur #product-options est INTROUVABLE DANS pageFragment."); // LOG 7 (modifié)
        if (!data.options || data.options.length === 0) console.log("V.createPageFragment: PAS d'options ('data.options') dans les données reçues.");
    }

    console.log("V.createPageFragment: Fragment final avant retour:", pageFragment.cloneNode(true)); // LOG 8

    return pageFragment;
};


V.attachEvents = function(pageFragment) {
    const addToCartBtn = pageFragment.querySelector('#add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', C.handler_addToCart);
    }

    // --- AJOUT US008: Écouteurs pour les <select> ---
    const optionSelects = pageFragment.querySelectorAll('#product-options select');
    optionSelects.forEach(select => {
        select.addEventListener('change', C.handler_optionChange);
    });
    // --- FIN AJOUT US008 ---

    return pageFragment;
};

// --- NOUVELLES FONCTIONS VUE US008 ---
V.updatePrice = function(price) {
    const priceEl = document.querySelector('#product-price');
    if (priceEl) {
        priceEl.textContent = `${parseFloat(price).toFixed(2)} €`;
    }
};

V.enableAddToCart = function(inStock = true) {
    const btn = document.querySelector('#add-to-cart-btn');
    if (btn) {
        btn.disabled = false;
        if (inStock) {
            btn.textContent = 'Ajouter au panier';
        } else {
            btn.textContent = 'Rupture de stock';
            btn.disabled = true;
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
    // Délègue la mise à jour au cartModule
    cartModule.updateCartCounter();
};

V.renderError = function(message) {
    // ... (votre fonction renderError existante)
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
// --- FIN NOUVELLES FONCTIONS VUE US008 ---

export function ProductDetailPage(params) {
    return C.init(params);
}