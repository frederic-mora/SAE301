import { htmlToFragment, genericRenderer, assetPath } from "../../lib/utils.js";
import template from "./template.html?raw";

let HeaderView = {
  html: function () {
    return genericRenderer(template, { logoSrc: assetPath('Logo.png') });
  },

  dom: function () {
    const fragment = htmlToFragment(genericRenderer(template, { logoSrc: assetPath('Logo.png') }));
    const observer = new MutationObserver(() => {
      HeaderView.highlightActiveCategory();
      observer.disconnect(); // Stop observing after the function is called
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return fragment;
  },

  highlightActiveCategory: function () {
    const parts = location.pathname.split('/').filter(Boolean);
    const idx = parts.indexOf('categories');
    const categoryName = idx >= 0 && parts.length > idx + 1 ? decodeURIComponent(parts[idx + 1]) : null;
    if (!categoryName) return;
    document.querySelectorAll('#header-categories a[href*="/categories/"]').forEach(a => {
      const linkText = decodeURIComponent(a.textContent.trim());
      a.style.textDecoration = (linkText === categoryName) ? "underline" : "";
    });
  }
};

export { HeaderView };
