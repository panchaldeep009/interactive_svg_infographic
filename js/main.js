"use strict";


// FUNCTIONS 

function createSVGElement(tag,attributes,content){
    let element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    if(attributes != null){
        Object.entries(attributes).forEach(([attrName, attrValue]) => {
            element.setAttribute(attrName,attrValue);
        });
    }
    if(content != null){
        element.innerHTML = content;
    }
    return element;
}