import { genericRenderer } from "../../lib/utils.js";
import template from "./template.html?raw";

let ProductView = {
  render: function (data) {
    let html = "";
    for (let obj of data) {
      html += genericRenderer(template, obj);
    }
    return html;
  },
};

export { ProductView };
