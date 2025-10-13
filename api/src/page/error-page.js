import { ErrorView } from "../ui/error/index.js";

let C = {};
C.init = function(){
    let app = document.querySelector("#app");
    app.innerHTML = ErrorView.render();
}


export function The404Page(){
    C.init();
}
