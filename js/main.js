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


// Draw Posters in background 
(() => {
    const posterBackground = document.querySelector('#posterBackground');
    posterBackground.setAttribute("viewBox",`0 0 ${posterBackground.getBoundingClientRect().width} ${posterBackground.getBoundingClientRect().height}`);
    
    const posterCountX = Math.round((document.body.clientWidth)/90);

    let posterWidth = document.body.clientWidth/posterCountX;
    let posterHeight = (posterWidth*445)/300;

    let posterPosX = 0;
    let posterPosY = 0

    moviesInfo.forEach(movie => {

        let poster = document.createElementNS('http://www.w3.org/2000/svg','image');
        poster.setAttributeNS(null,'height', posterHeight);
        poster.setAttributeNS(null,'width', posterWidth);
        poster.setAttributeNS('http://www.w3.org/1999/xlink','href', movie.Poster);
        poster.setAttributeNS(null,'x',posterWidth*posterPosX);
        poster.setAttributeNS(null,'y',posterHeight*posterPosY);
        poster.setAttributeNS(null, 'visibility', 'visible');

        posterBackground.appendChild(poster);

        if(posterPosX > (posterCountX-1)){
            posterPosX = 0;
            posterPosY++;
        } else {
            posterPosX++;
        }

    });

    window.addEventListener("resize", 
        function() { resizePosters(posterBackground); }, 
    false);
    
    function resizePosters(posterBackground){

        posterBackground.setAttribute("viewBox",`0 0 ${posterBackground.getBoundingClientRect().width} ${posterBackground.getBoundingClientRect().height}`);
        
        const posterCountX = Math.round((document.body.clientWidth)/90);

        let posterWidth = document.body.clientWidth/posterCountX;
        let posterHeight = (posterWidth*445)/300;
    
        let posterPosX = 0;
        let posterPosY = 0
    
        posterBackground.querySelectorAll('image').forEach(poster => {

            poster.setAttributeNS(null,'height', posterHeight);
            poster.setAttributeNS(null,'width', posterWidth);
            poster.setAttributeNS(null,'x',posterWidth*posterPosX);
            poster.setAttributeNS(null,'y',posterHeight*posterPosY);

            if(posterPosX > (posterCountX-1)){
                posterPosX = 0;
                posterPosY++;
            } else {
                posterPosX++;
            }
    
        });
    }

})();