// client/src/pages/categories/page.js
import { ProductData } from "../../data/product.js";
import { ProductView } from "../../ui/product/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { fetchCategory } from "../../data/categories.js";

// --- MODEL ---
const Model = {
    products: [],
    categoryName: "",

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
        const target = this.normalizeString(categoryName);
        if (!target) return [];
        return (products || []).filter(p => {
            const fields = [
                p && (p.category || p.category_name || p.categoryName || p.slug || p.name || p.title),
                p && (p.category_id || p.categoryId || p.id)
            ].flat().map(this.normalizeString);
            if (fields.some(v => v === target || v.includes(target))) return true;
            if (Array.isArray(p && p.categories)) {
                return p.categories.some(c => this.normalizeString(c && (c.name || c)).includes(target));
            }
            return false;
        });
    },

    getCategoryIdFromHeaderByName(name) {
        try {
            const anchors = Array.from(document.querySelectorAll("#header-categories a[data-id]"));
            const norm = this.normalizeString(name);
            for (const a of anchors) {
                if (this.normalizeString(a.textContent || "") === norm) return a.dataset.id;
                const href = a.getAttribute("href") || "";
                const last = href.split("/").filter(Boolean).pop() || "";
                if (this.normalizeString(decodeURIComponent(last)) === norm) return a.dataset.id;
            }
        } catch (e) { /* ignore */ }
        return null;
    },

    async fetchProducts(categoryName) {
        const headerId = this.getCategoryIdFromHeaderByName(categoryName);
        const target = headerId || categoryName;
        let products = [];

        // Utilisation du fetch centralisé
        try {
            const json2 = await fetchCategory(target);
            products = this.extractArrayFromResponse(json2);
            if (products.length) return products;
        } catch (e) { /* ignore */ }

        // Fallback via ProductData
        if (typeof ProductData.fetchAll === 'function') {
            try {
                const respAll = await ProductData.fetchAll();
                const all = this.extractArrayFromResponse(respAll);
                products = this.enhancedFilter ? this.enhancedFilter(all, categoryName) : (all || []).filter(p => {
                    const n = this.normalizeString(categoryName);
                    return this.normalizeString(p && (p.category || p.name || p.title || '')).includes(n);
                });
                if (products.length) return products;
            } catch (e) { /* ignore */ }
        }

        return [];
    }
};

// --- VIEW ---
const View = {
    init(data, categoryName) {
        const fragment = this.createPageFragment(data, categoryName);
        this.attachEvents(fragment);
        return fragment;
    },

    createPageFragment(data, categoryName) {
        const pageFragment = htmlToFragment(template);
        const productsDOM = ProductView.dom(data);
        const slot = pageFragment.querySelector('slot[name="products"]');
        if (slot) slot.replaceWith(productsDOM);

        const nameEl = pageFragment.querySelector('[data-role="category-name"]');
        if (nameEl) nameEl.textContent = categoryName || '';

        return pageFragment;
    },

    attachEvents(pageFragment) {
        const root = pageFragment.firstElementChild;
        if (root) root.addEventListener("click", Controller.handler_clickOnProduct);
        return pageFragment;
    }
};

// --- CONTROLLER ---
const Controller = {
    async init(params) {
        const categoryName = this.getCategoryName(params);
        const products = await Model.fetchProducts(categoryName);
        Model.products = products || [];
        Model.categoryName = categoryName;
        return View.init(Model.products, categoryName);
    },

    getCategoryName(params) {
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
    },
};

// --- EXPORT ---
export function CategoriesPage(params) {
    return Controller.init(params);
}
