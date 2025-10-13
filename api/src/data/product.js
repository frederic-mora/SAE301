import {getRequest} from '../lib/api-request.js';


let ProductData = {};

let fakeProducts = [
    {
        id: 1,
        name: "Marteau",
    },
    {
        id: 2,
        name: "Tournevis",
    },
    {
        id: 3,
        name: "Clé à molette",
    },
    {
        id: 4,
        name: "Pince",
    },
    {
        id: 5,
        name: "Scie",
    },
    {
        id: 6,
        name: "Perceuse",
    },
    {
        id: 7,
        name: "Ponceuse",
    },
    {
        id: 8,
        name: "Mètre",
    },
    {
        id: 9,
        name: "Niveau à bulle",
    },
    {
        id: 10,
        name: "Cutter",
    }
]

ProductData.fetch = async function(id){
    let data = await getRequest('products/'+id);
    return data==false ? fakeProducts.pop() : [data];
}

ProductData.fetchAll = async function(){
    let data = await getRequest('products');
    return data==false ? fakeProducts : data;
}


export {ProductData};