"use strict";
(() => {
    
    let outputSVG = document.querySelector("#outSVG");
    let svgSize = { "width": 400, "height": (moviesWithGenres.length*8)+10 };

    outputSVG.setAttribute("viewBox",`0 0 ${svgSize.width} ${svgSize.height}`);

    Genres.forEach(function(genre,i){
        outputSVG.appendChild(
            createSVGElement('text',{
                "x": 10,
                "y": (20*(i))+20,
                "class": "gen",
                "data-genre":genre.Name,
                "data-hover-genre":genre.Name
             },genre.Name)
        );
        outputSVG.appendChild(
            createSVGElement('line',{
                "x1": 3,
                "y1": (20*(i))+25,
                "x2": 80,
                "y2": (20*(i))+25,
                "stroke":genre.color,
                "class": "genUnderline",
                "data-genre":genre.Name,
                "data-hover-genre":genre.Name
             })
        );
        outputSVG.appendChild(
            createSVGElement('circle',{
                "cx": 80,
                "cy": (20*(i))+25,
                "fill":genre.color,
                "r": 3,
                "data-genre":genre.Name,
                "data-hover-genre":genre.Name
             })
        );
    });
    moviesWithGenres.forEach(function(movie,i){
        outputSVG.appendChild(
            createSVGElement('text',{
                "x": svgSize.width-100,
                "y": (8*(i))+10,
                "class": "movName",
                "data-genre":movie.genres.toString(),
                "data-hover-movie":movie.Name,
                "data-movie":movie.Name
             },movie.Name)
        );
        movie.genres.forEach(function(thisGenre,thisI){
            Genres.forEach(function(genre,genI){
                if(genre.Name == thisGenre){
                    outputSVG.appendChild(
                        createSVGElement('path',{
                            "d": `M ${(svgSize.width-105)-(thisI*5)},${(8*(i))+7.5} 
                                    C ${(svgSize.width-105)-80},${(8*(i))+7.5},
                                        ${(svgSize.width-105)-80},${(20*(genI))+25},
                                        80,${(20*(genI))+25}`,
                            "stroke":genre.color,
                            "data-genre":genre.Name,
                            "data-movie":movie.Name,
                            "class": "conntLine"
                         })
                    );
                    outputSVG.appendChild(
                        createSVGElement('circle',{
                            "cx": (svgSize.width-105)-(thisI*5),
                            "cy": (8*(i))+7.5,
                            "fill":genre.color,
                            "data-genre":genre.Name,
                            "data-movie":movie.Name,
                            "r": 2
                         })
                    );
                }
            });
        });
    });

    outputSVG.querySelectorAll('[data-hover-genre]').forEach(thisElement => {
        thisElement.addEventListener('mouseover', function(){
            outputSVG.querySelectorAll('[data-genre]').forEach(onOfElement => {
                if(onOfElement.dataset.genre.includes(thisElement.dataset.hoverGenre)){
                    onOfElement.style.opacity = 1;
                } else {
                    onOfElement.style.opacity = 0.2;
                }
            })
        });

        thisElement.addEventListener('mouseout', function(){
            outputSVG.querySelectorAll('[data-genre]').forEach(onOfElement => {
                onOfElement.style.opacity = 1;
            })
        });
    });

    outputSVG.querySelectorAll('[data-hover-movie]').forEach(function(thisElement,i,allElements){
        thisElement.addEventListener('mouseover', function(){
            outputSVG.querySelectorAll('[data-movie]').forEach(oneOfElement => {
                if(thisElement.dataset.hoverMovie == oneOfElement.dataset.movie){
                    oneOfElement.style.opacity = 1;
                } else {
                    oneOfElement.style.opacity = 0.025;
                }
            })
        });

        thisElement.addEventListener('mouseout', function(){
            outputSVG.querySelectorAll('[data-movie]').forEach(oneOfElement => {
                oneOfElement.style.opacity = 1;
            })
        });
    });

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

    // blueBalls.addEventListener("change", function(){

    //     outputSVG.innerHTML = "";

    //     let xRange = 200;
    //     let yRange = 200;

    //     let targetCircle = document.createElementNS(svgNS, 'circle');
    //     Object.entries({
    //         "cx":20,
    //         "cy":(yRange/2),
    //         "r":10,
    //         "fill":"red"
    //     }).forEach(([attrName, attrValue]) => {
    //         targetCircle.setAttribute(attrName,attrValue);
    //     });

    //     let outCircles = [];
    //     let outPaths = [];

    //     for (let i = 0; i < this.value; i++) {

    //         outCircles[i] = document.createElementNS(svgNS, 'circle');
    //         Object.entries({
    //             "cx":180,
    //             "cy":(yRange/(parseInt(this.value)+1))*(i+1),
    //             "r":10,
    //             "fill":"blue"
    //         }).forEach(([attrName, attrValue]) => {
    //             outCircles[i].setAttribute(attrName,attrValue);
    //         });

    //         outPaths[i] = document.createElementNS(svgNS, 'path');
    //         Object.entries({
    //             "d":`M24 100 C 20 100, ${xRange/1.5} ${yRange/2}, 180 ${(yRange/(parseInt(this.value)+1))*(i+1)}`,
    //             "fill":"transparent",
    //             "stroke":"blue"
    //         }).forEach(([attrName, attrValue]) => {
    //             outPaths[i].setAttribute(attrName,attrValue);
    //         });

    //     }

    //     outPaths.forEach(function(thisPath,index,allPaths){ 
    //         thisPath.addEventListener('mouseover', function(){
    //             allPaths.map(thisPath => thisPath.style.opacity = 0.2);
    //             outCircles.map(thisCircle => thisCircle.style.opacity = 0.2);
    //             thisPath.style.opacity = 1;
    //             outCircles[index].style.opacity = 1;
    //         });
    //         thisPath.addEventListener('mouseout', function(){
    //             allPaths.map(otherPaths => otherPaths.style.opacity = 1);
    //             outCircles.map(thisCircle => thisCircle.style.opacity = 1);
    //         });
    //     });

    //     outCircles.forEach(function(thisCircle,index,allCircles){ 
    //         thisCircle.addEventListener('mouseover', function(){
    //             allCircles.map(thisCircle => thisCircle.style.opacity = 0.2);
    //             outPaths.map(thisPath => thisPath.style.opacity = 0.2);
    //             thisCircle.style.opacity = 1;
    //             outPaths[index].style.opacity = 1;
    //         });
    //         thisCircle.addEventListener('mouseout', function(){
    //             allCircles.map(thisCircle => thisCircle.style.opacity = 1);
    //             outPaths.map(thisPath => thisPath.style.opacity = 1);
    //         });
    //     });
    //     outPaths.map(outPath => { outputSVG.appendChild(outPath); });
    //     outCircles.map(outCircle => { outputSVG.appendChild(outCircle); });
    //     outputSVG.appendChild(targetCircle);
    // });

})();