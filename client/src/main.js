import { ProductData } from "./data/product.js";
import { ProductView } from "./ui/product/index.js";

import './index.css';

let C = {}

C.init = async function(){
    let data = await ProductData.fetchAll();
    let html = ProductView.render(data);
    document.querySelector("#main").innerHTML = html;
}


C.init();