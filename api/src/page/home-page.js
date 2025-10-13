import { HomeView } from "../ui/home/index.js";

let C = {};
C.init = function(){
    let app = document.querySelector("#app");
    app.innerHTML = HomeView.render();
}


export function HomePage(){
    C.init();
}
