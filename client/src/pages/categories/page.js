import { ProductData } from "../../data/product.js";
import { ProductView } from "../../ui/product/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let M = {
    products: [],

    normalizeString(s) {
        if (s === null || s === undefined) return "";
        return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    },

    extractArrayFromResponse(resp) {
        if (!resp) return [];
        if (Array.isArray(resp)) return resp;
        if (Array.isArray(resp.data)) return resp.data;
        if (Array.isArray(resp.products)) return resp.products;
        for (const k in resp) if (Array.isArray(resp[k])) return resp[k];
        return [];
    },

    filterByCategory(products, categoryName) {
        const target = M.normalizeString(categoryName);
        if (!target) return [];
        return (products || []).filter(p => {
            const fields = [
                p && (p.category || p.category_name || p.categoryName || p.slug || p.name || p.title),
                p && (p.category_id || p.categoryId || p.id)
            ].flat().map(M.normalizeString);
            if (fields.some(v => v === target || v.includes(target))) return true;
            if (Array.isArray(p && p.categories)) {
                return p.categories.some(c => M.normalizeString(c && (c.name || c)).includes(target));
            }
            return false;
        });
    },

    getCategoryIdFromHeaderByName(name) {
        try {
            const anchors = Array.from(document.querySelectorAll("#header-categories a[data-id]"));
            const norm = M.normalizeString(name);
            for (const a of anchors) {
                if (M.normalizeString(a.textContent || "") === norm) return a.dataset.id;
                const href = a.getAttribute("href") || "";
                const last = href.split("/").filter(Boolean).pop() || "";
                if (M.normalizeString(decodeURIComponent(last)) === norm) return a.dataset.id;
            }
        } catch (e) { /* ignore */ }
        return null;
    },

    async fetchProducts(categoryName) {
        const headerId = M.getCategoryIdFromHeaderByName(categoryName);
        const target = headerId || categoryName;
        let products = [];

        // tentative remote
        try {
            const remoteUrl = `https://mmi.unilim.fr/~pain11/SAE301/api/categories/${encodeURIComponent(target)}`;
            const r2 = await fetch(remoteUrl, { credentials: 'same-origin' });
            if (r2 && r2.ok) {
                const json2 = await r2.json();
                products = M.extractArrayFromResponse(json2);
                if (products.length) return products;
            }
        } catch (e) { /* ignore */ }

        // fallback via ProductData.fetchAll
        if (typeof ProductData.fetchAll === 'function') {
            try {
                const respAll = await ProductData.fetchAll();
                const all = M.extractArrayFromResponse(respAll);
                products = M.enhancedFilter ? M.enhancedFilter(all, categoryName) : (all || []).filter(p => {
                    const n = M.normalizeString(categoryName);
                    return M.normalizeString(p && (p.category || p.name || p.title || '')).includes(n);
                });
                if (products.length) return products;
            } catch (e) { /* ignore */ }
        }

        return [];
    }
};

let C = {};
function getCategoryName(params) {
    if (params && params.name) return params.name;

    try {
        const anchors = Array.from(document.querySelectorAll('#header-categories a[href*="/categories/"]'));
        if (anchors.length) {
            const currentPath = location.pathname;
            const match = anchors.find(a => {
                const href = a.getAttribute('href') || '';
                try { return new URL(href, location.origin).pathname === currentPath; } catch (e) { return false; }
            });
            const text = (match || anchors[0]).textContent || '';
            return decodeURIComponent(text.trim());
        }
    } catch (e) { /* ignore */ }

    const parts = location.pathname.split('/').filter(Boolean);
    const idx = parts.indexOf('categories');
    if (idx >= 0 && parts.length > idx + 1) return decodeURIComponent(parts[idx + 1]);
    return 'Horlogerie';
}

C.init = async function(params) {
    const categoryName = getCategoryName(params);
    const products = await M.fetchProducts(categoryName);
    M.products = products || [];
    M.categoryName = categoryName;
    return V.init(M.products, categoryName);
};

let V = {};

V.init = function(data, categoryName) {
    const fragment = V.createPageFragment(data, categoryName);
    V.attachEvents(fragment);
    return fragment;
};

V.createPageFragment = function(data, categoryName) {
    const pageFragment = htmlToFragment(template);
    const productsDOM = ProductView.dom(data);
    const slot = pageFragment.querySelector('slot[name="products"]');
    if (slot) slot.replaceWith(productsDOM);

    const nameEl = pageFragment.querySelector('[data-role="category-name"]');
    if (nameEl) nameEl.textContent = categoryName || '';

    return pageFragment;
};

V.attachEvents = function(pageFragment) {
    const root = pageFragment.firstElementChild;
    if (root) root.addEventListener("click", C.handler_clickOnProduct);
    return pageFragment;
};

export function CategoriesPage(params) {
    return C.init(params);
}