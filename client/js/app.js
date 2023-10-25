import { getRequest } from "./api-queries.js";
import { render as productRender } from "./renderer/product-renderer.js";
M = {
    products: undefined
}

M.products = await getRequest("..../products");

V = {}

C = {}

C.init = async function(){}
   

C.init();