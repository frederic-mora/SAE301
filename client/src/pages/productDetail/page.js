import { ProductData } from "../../data/product.js";
import { ProductGallery } from "../../data/productGallery.js";
import { BasketData } from "../../data/basket.js";
import { BasketView } from "../../ui/basket/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import { DetailView } from "../../ui/detail/index.js";
import { MignatureView } from "../../ui/mignature/index.js";
import { ToastManager } from "../../lib/toast.js";
import template from "./template.html?raw";



let M = {
    products: [],
    Gall: []
};

M.getProductById = function(id){
    return M.products.find(product => product.id == id);
}

M.getProdGall=async function(productId){
    M.Gall = await ProductGallery.fetchGall(productId);
    
}

M.filterGallById = function(id) {
    // Convertir l'id en nombre car dataset renvoie toujours une chaîne
    const numId = parseInt(id, 10);
    const filteredImages = M.Gall.filter(image => image.id == numId);
    // Retourner le premier élément trouvé ou null
    return filteredImages.length > 0 ? filteredImages[0] : null;
}

let C = {};

C.handler_clickOnProduct = function(ev){
    if (ev.target.dataset.buy !== undefined){
        let productId = parseInt(ev.target.dataset.buy);
        let product = M.getProductById(productId);
        
        if (product) {
            // Récupérer la quantité depuis l'input
            const quantityInput = document.querySelector('#quantityInput');
            let quantity = 1;
            
            if (quantityInput) {
                quantity = Math.max(1, parseInt(quantityInput.value) || 1);
            }
            
            // Ajouter au panier avec la quantité spécifiée
            BasketData.addItem({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price) || 0,
                image: product.image || '',
                collection: product.collection || 'Collection',
                statut: product.statut || product.status || 'Produit'
            }, quantity);
            
            // Mettre à jour le badge du panier
            BasketView.updateBadge();
            
            // Réinitialiser la quantité
            if (quantityInput) {
                quantityInput.value = 1;
            }
            
            // Afficher un message de succès avec un toast
            ToastManager.success(`${quantity}x ${product.name} ajouté au panier!`);
            
            // Optionnel: ouvrir le panier
            // BasketView.show();
        }
    }
}

C.init = async function(params) {
    // Récupérer l'ID depuis les paramètres de route
    const productId = params.id;
    
    // Charger le produit et sa galerie depuis l'API
    M.products = await ProductData.fetchAll();
    M.Gall = await ProductGallery.fetchGall(productId);
    
    let p = M.getProductById(productId);
    
    let mignatureDOM = "";
    
        for (let image of M.Gall) {
            mignatureDOM += MignatureView.html(image);
        }
    

    

    return V.init(p,htmlToFragment(mignatureDOM));
}

C.handler_clickOnGallery = function(ev) {
    const clickedElement = ev.target.closest('[data-id]');
    if (!clickedElement) {
        console.log("No element with data-id found");
        return;
    }

    const imageId = clickedElement.dataset.id;
    console.log("Clicked image ID:", imageId);
    const gallItem = M.filterGallById(imageId);
    console.log("Gallery item found:", gallItem);

    if (!gallItem) {
        console.error("No gallery item found for ID:", imageId);
        return;
    }

    const mainImage = document.querySelector('#mainImage');
    if (!mainImage) {
        console.error("Main image element not found");
        return;
    }

    try {
        mainImage.src = `../../../public/productsImage/${gallItem.path}/${gallItem.image}.webp`;
        console.log("Updated main image src:", mainImage.src);
    } catch (error) {
        console.error("Error updating image:", error);
    }
}



let V = {};

V.init = function(data, gallery) {
    let fragment = V.createPageFragment(data);
    
    // Ajouter les miniatures aux deux conteneurs
    let mignatureContainer = fragment.querySelector('#migniatureContainer');
    let mignatureContainerMobile = fragment.querySelector('#migniatureContainerMobile');
    mignatureContainer.appendChild(gallery);
    // mignatureContainerMobile.appendChild(gallery);

    // Initialiser la navigation mobile
    V.initMobileNavigation(fragment);
    V.attachEvents(fragment);

    return fragment;
}

V.initMobileNavigation = function(fragment) {
    const container = fragment.querySelector('#migniatureContainer');
    const prevButton = fragment.querySelector('#prevButton');
    const nextButton = fragment.querySelector('#nextButton');
    
    if (!container || !prevButton || !nextButton) return;

    // Détermine si on est en mode desktop
    const isDesktop = () => window.innerWidth >= 1024;

    // Scroll par item
    const getScrollAmount = () => {
        const firstItem = container.firstElementChild;
        if (!firstItem) return 0;
        // En desktop, utiliser la hauteur + marge, sinon la largeur + marge
        if (isDesktop()) {
            return firstItem.offsetHeight + parseInt(getComputedStyle(firstItem).marginBottom, 10);
        } else {
            return firstItem.offsetWidth + parseInt(getComputedStyle(firstItem).marginRight, 10);
        }
    };

    // Navigation précédente (haut/gauche)
    prevButton.addEventListener('click', () => {
        const scrollAmount = getScrollAmount();
        if (scrollAmount) {
            if (isDesktop()) {
                container.scrollBy({
                    top: -scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                container.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    });

    // Navigation suivante (bas/droite)
    nextButton.addEventListener('click', () => {
        const scrollAmount = getScrollAmount();
        if (scrollAmount) {
            if (isDesktop()) {
                container.scrollBy({
                    top: scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                container.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    });

    // Mise à jour de la visibilité des boutons
    const updateButtonsVisibility = () => {
        if (isDesktop()) {
            const isAtStart = container.scrollTop <= 0;
            const isAtEnd = container.scrollTop + container.clientHeight >= container.scrollHeight;
            prevButton.style.opacity = isAtStart ? '0.5' : '1';
            nextButton.style.opacity = isAtEnd ? '0.5' : '1';
        } else {
            const isAtStart = container.scrollLeft <= 0;
            const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth;
            prevButton.style.opacity = isAtStart ? '0.5' : '1';
            nextButton.style.opacity = isAtEnd ? '0.5' : '1';
        }
    };

    container.addEventListener('scroll', updateButtonsVisibility);
    window.addEventListener('resize', () => {
        // Reset scroll position on layout change
        container.scrollTop = 0;
        container.scrollLeft = 0;
        updateButtonsVisibility();
    });
    updateButtonsVisibility(); // État initial
}

V.createPageFragment = function(data) {
    // Créer le fragment depuis le template
    let pageFragment = htmlToFragment(template);
    
    // Générer le composant detail
    let detailDOM = DetailView.dom(data);
    
    // Remplacer le slot par le composant detail
    pageFragment.querySelector('slot[name="detail"]').replaceWith(detailDOM);
    
    return pageFragment;
}

V.attachEvents = function(pageFragment) {
    // Attacher un event listener au bouton ajouter au panier
    const addToCartBtn = pageFragment.querySelector('[data-buy]');
    addToCartBtn.addEventListener('click', C.handler_clickOnProduct);
    
    // Gestion de la quantité
    const quantityInput = pageFragment.querySelector('#quantityInput');
    const increaseBtn = pageFragment.querySelector('#increaseQtyBtn');
    const decreaseBtn = pageFragment.querySelector('#decreaseQtyBtn');
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (quantityInput) {
                let currentValue = parseInt(quantityInput.value) || 1;
                quantityInput.value = currentValue + 1;
            }
        });
    }
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (quantityInput) {
                let currentValue = parseInt(quantityInput.value) || 1;
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            }
        });
    }
    
    // Validation de l'input quantité
    if (quantityInput) {
        quantityInput.addEventListener('change', (e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value) || value < 1) {
                e.target.value = 1;
            } else if (value > 999) {
                e.target.value = 999;
            }
        });
    }
    
    const gallery = pageFragment.querySelector('#migniatureContainer');
    gallery.addEventListener('click', C.handler_clickOnGallery);
    return pageFragment;
}

// Helper function to render a single gallery image
V.renderMignature = function(imageData) {
    return MignatureView.html(imageData);
}

export function ProductDetailPage(params) {
    console.log("ProductDetailPage", params);
    return C.init(params);
}
