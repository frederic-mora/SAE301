import { ProductData} from "../data/product.js";
import { ProductView} from "../ui/product/index.js";

let M ={
    products:[]
};
let C = {};
let V={};
V.init = function(data){
    let app=document.querySelector("#app");
    app.innerHTML= ProductView.render(data);
}
C.init = async function(){
    // ici les données sont stockée en cache et peu nous permettre de ne pas tout le temps faire du fetch
    M.products = await ProductData.fetchAll();
    V.init(M.products);

}



export function ProductPage(){
    C.init();
}