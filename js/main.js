"use strict";
(() => {
    //// Circular Connecting SVG
    
    let cirInfoSVG = document.querySelector("#circularInfographic");
    
    let svgSize = { "width": 600, "height": 700 };

    cirInfoSVG.innerHTML = "";
    cirInfoSVG.setAttribute("viewBox",`0 0 ${svgSize.width} ${svgSize.height}`);
    let flowerPer = { 
        "fX":300,"fY":385,"fR":195,
        "fDeg": 360,"fOffDeg": 45,
        "leafs":5,
        "lR":55,"lDeg":270,
        "data":moviesWithGenres.slice(0)
    };
    var splitData = [];
    for (let i = flowerPer.leafs; i > 0; i--) {
        splitData.push(flowerPer.data.splice(0, Math.ceil(flowerPer.data.length / i)));
    }
    splitData.forEach(function(data,i){

        // dataToCircle(SVG,data,cirX,cirY,radius,degree,offDegree)
        dataToCircle(cirInfoSVG,data,Genres,
            (Math.cos((((flowerPer.fDeg/flowerPer.leafs)*i)+(flowerPer.fOffDeg)) * Math.PI / 180.0)*flowerPer.fR)+flowerPer.fX,
            (Math.sin((((flowerPer.fDeg/flowerPer.leafs)*i)+(flowerPer.fOffDeg)) * Math.PI / 180.0)*flowerPer.fR)+flowerPer.fY,
            flowerPer.lR,flowerPer.lDeg,flowerPer.fOffDeg+(flowerPer.lDeg-45)+((flowerPer.fDeg/flowerPer.leafs)*i)+5,
            flowerPer.fX,flowerPer.fY);
    });
    
    let maxGenCount = Math.max(...Genres.map(g => g.count));
    let allSum = 0;
    Genres.map(g => g.count).forEach(c => { allSum += Math.round((20*c/maxGenCount) < 2 ? 2 : (20*c/maxGenCount)); });
    
    Genres.forEach(function(genre,genI,allGen){
        
        cirInfoSVG.appendChild(
            createSVGElement('text',{
                "x": 15+(15*genI),
                "y": 75,
                "style":`transform: rotate(-60deg); transform-origin: ${15+(15*genI)}px ${75}px`,
                "class": "genName",
                "data-genre":genre.Name,
                "data-hover-genre":genre.Name,
            }, ('0'+genre.count).slice(-2)+"&emsp;&emsp;&emsp;"+genre.Name)
        );

        cirInfoSVG.appendChild(
            createSVGElement('circle',{
                "cx": 20+(15*genI),
                "cy": 55,
                "fill":genre.color,
                "data-genre":genre.Name,
                "data-hover-genre":genre.Name,
                "r": 5
            })
        );
        
        let sumOfLast = 0;
        let lastGenres = allGen.slice(0);
        lastGenres.splice(0,genI+1).map(g => g.count).forEach(c => { sumOfLast += averageRadius(c,maxGenCount,20); });

        cirInfoSVG.appendChild(
            createSVGElement('circle',{
                "cx": (flowerPer.fX-(allSum))+(sumOfLast*1.8),
                "cy": flowerPer.fY,
                "fill":genre.color,
                "data-genre":genre.Name,
                "data-hover-genre":genre.Name,
                "r": (20*genre.count/maxGenCount) < 2 ? 2 : (20*genre.count/maxGenCount)
             })
        );       
    });

    function averageRadius(c,max,p){ return (Math.round((p*c/max) < 2 ? 2 : (p*c/max)))}
    function dataToCircle(cirInfoSVG,datas,Genres,cirX,cirY,redius,degree,offDegree,pX,pY){
        datas.forEach(function(thisData,i,allMovies){
            thisData.genres.forEach(function(thisGenre,thisI){
                
                let maxGenCount = Math.max(...Genres.map(g => g.count));
                let allSum = 0;
                Genres.map(g => g.count).forEach(c => { allSum += averageRadius(c,maxGenCount,20); });
                
                Genres.forEach(function(genre,genI,allGen){
                   if(genre.Name == thisGenre){

                    let sumOfLast = 0;
                    let lastGenres = allGen.slice(0);
                    lastGenres.splice(0,genI+1).map(g => g.count).forEach(c => { sumOfLast += averageRadius(c,maxGenCount,20); });

                    let genRadius = averageRadius(genre.count,maxGenCount,20);
                    let randomToleranceX = (Math.floor(Math.random() * genRadius) -(genRadius/2) );
                    let randomToleranceY = (Math.floor(Math.random() * genRadius) -(genRadius/2) );

                    cirInfoSVG.appendChild(
                        createSVGElement('path',{
                            "d": `M ${(pX-(allSum)+randomToleranceX)+(sumOfLast*1.8)},${pY+randomToleranceY}
                                    C ${cirX},${cirY},
                                        ${(Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(redius-(20)))+cirX},
                                        ${(Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(redius-(20)))+cirY},
                                        ${(Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(redius-(5*thisI)))+cirX},
                                        ${(Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(redius-(5*thisI)))+cirY},`,
                            "stroke":genre.color,
                            "data-genre":genre.Name,
                            "data-movie":thisData.Name,
                            "class": "conntLine"
                         })
                    );
                    cirInfoSVG.appendChild(
                        createSVGElement('circle',{
                            "cx": (Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(redius-(5*thisI)))+cirX,
                            "cy": (Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(redius-(5*thisI)))+cirY,
                            "fill":genre.color,
                            "data-genre":genre.Name,
                            "data-movie":thisData.Name,
                            "r": 2
                         })
                    );
                    }
                });
            });
            cirInfoSVG.appendChild(
                createSVGElement('line',{
                    "x1": (Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(redius+3))+cirX,
                    "y1": (Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(redius+3))+cirY,
                    "x2": (Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(redius+8))+cirX,
                    "y2": (Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(redius+8))+cirY,
                    "stroke":"red",
                    "id":"tLine",
                    "class": "genUnderline",
                })
            );
            cirInfoSVG.appendChild(
                createSVGElement('text',{
                    "x": cirX+redius+8,
                    "y": cirY+2,
                    "style":`transform: rotate(${((degree/allMovies.length)*i)+(offDegree)}deg); transform-origin: ${cirX}px ${cirY}px`,
                    "class": "movName",
                    "data-genre":thisData.genres.toString(),
                    "data-hover-movie":thisData.Name,
                    "data-movie":thisData.Name
                }, thisData.Name.length > 18 ? thisData.Name.substr(0,15)+" .." : thisData.Name)
            );
        });
    }

    /// Mouse Events

    cirInfoSVG.querySelectorAll('[data-hover-genre]').forEach(thisElement => {
        thisElement.addEventListener('mouseover', function(){
            cirInfoSVG.querySelectorAll('[data-genre]').forEach(onOfElement => {
                if(onOfElement.dataset.genre.includes(thisElement.dataset.hoverGenre)){
                    onOfElement.style.opacity = 1;
                } else {
                    onOfElement.style.opacity = 0.025;
                }
            })
        });

        thisElement.addEventListener('mouseout', function(){
            cirInfoSVG.querySelectorAll('[data-genre]').forEach(onOfElement => {
                onOfElement.style.opacity = 1;
            })
        });
    });

    cirInfoSVG.querySelectorAll('[data-hover-movie]').forEach(thisElement => {
        thisElement.addEventListener('mouseover', function(){
            cirInfoSVG.querySelectorAll('[data-movie]').forEach(oneOfElement => {
                if(thisElement.dataset.hoverMovie == oneOfElement.dataset.movie){
                    oneOfElement.style.opacity = 1;
                } else {
                    oneOfElement.style.opacity = 0.025;
                }
            });
            cirInfoSVG.querySelectorAll('[data-hover-genre]').forEach(oneOfElement => {
                if(thisElement.dataset.genre.includes(oneOfElement.dataset.hoverGenre)){
                    oneOfElement.style.opacity = 1;
                } else {
                    oneOfElement.style.opacity = 0.025;
                }
            })
        });

        thisElement.addEventListener('mouseout', function(){
            cirInfoSVG.querySelectorAll('[data-movie]').forEach(oneOfElement => {
                oneOfElement.style.opacity = 1;
            });
            cirInfoSVG.querySelectorAll('[data-hover-genre]').forEach(oneOfElement => {
                oneOfElement.style.opacity = 1;
            });
        });
    });

    //// Liner Connecting SVG

    let linInfoSVG = document.querySelector("#linerInfographic");

    svgSize = { "width": 400, "height": (moviesWithGenres.length*8)+10 };

    let genDistance = svgSize.height/23;
    
    linInfoSVG.setAttribute("viewBox",`0 0 ${svgSize.width} ${svgSize.height}`);

    Genres.forEach(function(genre,i){
        linInfoSVG.appendChild(
            createSVGElement('text',{
                "x": 10,
                "y": (genDistance*(i))+20,
                "class": "gen",
                "data-genre":genre.Name,
                "data-hover-genre":genre.Name
             },genre.Name)
        );
        linInfoSVG.appendChild(
            createSVGElement('line',{
                "x1": 3,
                "y1": (genDistance*(i))+25,
                "x2": 80,
                "y2": (genDistance*(i))+25,
                "stroke":genre.color,
                "class": "genUnderline",
                "data-genre":genre.Name,
                "data-hover-genre":genre.Name
             })
        );
        linInfoSVG.appendChild(
            createSVGElement('circle',{
                "cx": 80,
                "cy": (genDistance*(i))+25,
                "fill":genre.color,
                "r": 3,
                "data-genre":genre.Name,
                "data-hover-genre":genre.Name
             })
        );
    });
    moviesWithGenres.forEach(function(movie,i){
        linInfoSVG.appendChild(
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
                    linInfoSVG.appendChild(
                        createSVGElement('path',{
                            "d": `M ${(svgSize.width-105)-(thisI*5)},${(8*(i))+7.5} 
                                    C ${(svgSize.width-105)-80},${(8*(i))+7.5},
                                        ${(svgSize.width-105)-80},${(genDistance*(genI))+25},
                                        80,${(genDistance*(genI))+25}`,
                            "stroke":genre.color,
                            "data-genre":genre.Name,
                            "data-movie":movie.Name,
                            "class": "conntLine"
                         })
                    );
                    linInfoSVG.appendChild(
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

    linInfoSVG.querySelectorAll('[data-hover-genre]').forEach(thisElement => {
        thisElement.addEventListener('mouseover', function(){
            linInfoSVG.querySelectorAll('[data-genre]').forEach(onOfElement => {
                if(onOfElement.dataset.genre.includes(thisElement.dataset.hoverGenre)){
                    onOfElement.style.opacity = 1;
                } else {
                    onOfElement.style.opacity = 0.2;
                }
            })
        });

        thisElement.addEventListener('mouseout', function(){
            linInfoSVG.querySelectorAll('[data-genre]').forEach(onOfElement => {
                onOfElement.style.opacity = 1;
            })
        });
    });

    linInfoSVG.querySelectorAll('[data-hover-movie]').forEach(function(thisElement,i,allElements){
        thisElement.addEventListener('mouseover', function(){
            linInfoSVG.querySelectorAll('[data-movie]').forEach(oneOfElement => {
                if(thisElement.dataset.hoverMovie == oneOfElement.dataset.movie){
                    oneOfElement.style.opacity = 1;
                } else {
                    oneOfElement.style.opacity = 0.025;
                }
            })
        });

        thisElement.addEventListener('mouseout', function(){
            linInfoSVG.querySelectorAll('[data-movie]').forEach(oneOfElement => {
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

})();