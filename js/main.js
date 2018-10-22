"use strict";
(() => {
    
    let blueBalls = document.querySelector("#blueBalls");
    let outputSVG = document.querySelector("#outSVG");
    let svgNS = "http://www.w3.org/2000/svg";

    blueBalls.addEventListener("change", function(){

        outputSVG.innerHTML = "";

        let xRange = 200;
        let yRange = 200;

        let targetCircle = document.createElementNS(svgNS, 'circle');
        Object.entries({
            "cx":20,
            "cy":100,
            "r":10,
            "fill":"red"
        }).forEach(([attrName, attrValue]) => {
            targetCircle.setAttribute(attrName,attrValue);
        });

        let outCircles = [];
        let outPaths = [];

        for (let i = 0; i < this.value; i++) {

            outCircles[i] = document.createElementNS(svgNS, 'circle');
            Object.entries({
                "cx":180,
                "cy":(yRange/(parseInt(this.value)+1))*(i+1),
                "r":10,
                "fill":"blue"
            }).forEach(([attrName, attrValue]) => {
                outCircles[i].setAttribute(attrName,attrValue);
            });

            outPaths[i] = document.createElementNS(svgNS, 'path');
            Object.entries({
                "d":`M24 100 C 20 100, ${xRange/1.5} ${yRange/2}, 180 ${(yRange/(parseInt(this.value)+1))*(i+1)}`,
                "fill":"transparent",
                "stroke":"blue"
            }).forEach(([attrName, attrValue]) => {
                outPaths[i].setAttribute(attrName,attrValue);
            });

        }

        outPaths.forEach(function(thisPath,index,allPaths){ 
            thisPath.addEventListener('mouseover', function(){
                allPaths.map(thisPath => thisPath.style.opacity = 0.2);
                outCircles.map(thisCircle => thisCircle.style.opacity = 0.2);
                thisPath.style.opacity = 1;
                outCircles[index].style.opacity = 1;
            });
            thisPath.addEventListener('mouseout', function(){
                allPaths.map(otherPaths => otherPaths.style.opacity = 1);
                outCircles.map(thisCircle => thisCircle.style.opacity = 1);
            });
        });

        outCircles.forEach(function(thisCircle,index,allCircles){ 
            thisCircle.addEventListener('mouseover', function(){
                allCircles.map(thisCircle => thisCircle.style.opacity = 0.2);
                outPaths.map(thisPath => thisPath.style.opacity = 0.2);
                thisCircle.style.opacity = 1;
                outPaths[index].style.opacity = 1;
            });
            thisCircle.addEventListener('mouseout', function(){
                allCircles.map(thisCircle => thisCircle.style.opacity = 1);
                outPaths.map(thisPath => thisPath.style.opacity = 1);
            });
        });

        outPaths.map(outPath => { outputSVG.appendChild(outPath); });
        outCircles.map(outCircle => { outputSVG.appendChild(outCircle); });
        outputSVG.appendChild(targetCircle);
    });

})();