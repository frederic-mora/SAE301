
import { Product } from "./product.js";
import { getRequest } from "../api-queries.js";

class ProductCollection {

    #products;

    constructor(){
        this.#products = [];
    }

    async load(uri){
        let objects = await getRequest(uri);
        for(let item of objects){
            let p = new Product(item.id, item.name, item.category);
            this.add(p);
        }
        return this.#products.length;
    }

    add(p){
        if ( p instanceof Product)
            this.#products.push(p);
    }

    find(id){
        return this.#products.find( p => p.getId()==id );
    }

    findByCategory(idcat){
        return this.#products.filter( p => p.getIdCategory()==idcat);
    }
}


export let ProductManager = new ProductCollection();
