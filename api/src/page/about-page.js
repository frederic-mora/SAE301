import { AboutView } from "../ui/about/index.js";

let C = {};
C.init = function(){
    let app = document.querySelector("#app");
    app.innerHTML = AboutView.render();
}


export function AboutPage(){
    C.init();
}
