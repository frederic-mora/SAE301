import { Product } from "../class/product.js";

const productTemplate = document.querySelector("#product-template").innerHTML;
  
let render = function(data){
  
    let html = "";
    let all = "";
    if (data instanceof Array === false) {
        console.error( "data has to be an array of Products");
        return all;
    }
    for(let p of data){
        if (p instanceof Product){
            html = productTemplate.replace("{{id}}", p.getId() );
            html = html.replace("{{name}}", p.getName() );
            html = html.replace("{{category}}", p.getIdCategory() );
            all += html;
        }
    }

    return all;
 }

 export {render as productRenderer};