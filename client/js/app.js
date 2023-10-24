 import {ProductCollection} from "./class/product-manager.js";
       

 let M = {
     products: new ProductCollection()
 }

 let V = {}

 V.init = function(){
    document.querySelector("section").addEventListener("click", C.handler);
 }
 V.render = function(data){
    let tpl = document.querySelector("#product-template").innerHTML;
    let html = "";
    let all = "";
    for(let p of data){
        html = tpl.replace("{{id}}", p.getId() );
        html = html.replace("{{name}}", p.getName() );
        html = html.replace("{{category}}", p.getIdCategory() );
        all += html;
    }

    document.querySelector("section").innerHTML = all;

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
     V.render(M.products.findAll());
 }


 export {C as App}
