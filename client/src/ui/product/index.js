import { genericRenderer, htmlToFragment, getStockStatus } from "../../lib/utils.js"; // AJOUT US009: getStockStatus
import template from "./template.html?raw";

let ProductView = {
  html: function (data) {
    let htmlString = '<div style="display: flex; flex-wrap: wrap; flex-direction: row; gap: 1rem; justify-content: center">';
    for (let obj of data) {

      const stockStatus = getStockStatus(obj.totalStock);

      const renderData = {
        ...obj,
        stockText: stockStatus.text,
        stockClass: stockStatus.class
      };

      htmlString  += genericRenderer(template, renderData);
    }
    return htmlString + '</div>';
  },

  dom: function (data) {
    return htmlToFragment( ProductView.html(data) );
  }

};

export { ProductView };