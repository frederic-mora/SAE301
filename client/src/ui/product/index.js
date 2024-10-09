import { genericRenderer } from "../../lib/utils.js"; 

const templateFile = await fetch("src/ui/product/template.html.inc");
const template = await templateFile.text();


let ProductView = {

    render: function(data){
        let html = "";
        for(let obj of data){
            html += genericRenderer(template, obj);
        }
        return html;
    }

}

export {ProductView};