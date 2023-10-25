import { ProductCollection } from "./class/product-manager.js";
import { productRenderer } from "./renderer/product-renderer.js";
       

 let M = {
     products: new ProductCollection()
 }

 let V = {}

 V.init = function(){
    document.querySelector("section").addEventListener("click", C.handler);
 }
 
 V.render = function(data){
    document.querySelector("section").innerHTML = productRenderer(data);
 }

 let C = {}

 C.handler = function(ev){
    ev.target.style.backgroundColor = 'red';
    console.log(ev.target);
 }

 C.init = async function(){
     let nb = await M.products.load("http://localhost:3000/api/products");
     console.log(nb + " products added in the ProductCollection");
     V.init();
     V.render(M.products.findByCategory(2));
 }


 export {C as App}
