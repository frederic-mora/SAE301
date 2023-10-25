import { ProductCollection } from "./class/product-collection.js";
import { productRenderer } from "./renderer/product-renderer.js";
       

 let M = {
     products: new ProductCollection()
 }

 let V = {}

 V.render = function(data){
    // le produits sont affichés dans section
    document.querySelector("section").innerHTML = productRenderer(data);
 }

 let C = {}

 C.init = async function(){
     let nb = await M.products.load("http://localhost:3000/api/products");
     console.log(nb + " products added in the ProductCollection");
     V.render( M.products.findAll() );
 }

C.init();