"use strict";
(() => {
    
    let cirInfoSVG = document.querySelector("#circularInfographic");
    let linInfoSVG = document.querySelector("#linerInfographic");
    let svgSize = { "width": 500, "height": 850 };

    cirInfoSVG.setAttribute("viewBox",`0 0 ${svgSize.width} ${svgSize.height}`);

    let redius = 150;
    let degree = 270;
    let offDegree = 182.5;
    let cirX = 250;
    let cirY = 250;
    
    moviesWithGenres.slice(0,(moviesWithGenres.length-1)/2).forEach(function(movie,i,allMovies){
        cirInfoSVG.appendChild(
            createSVGElement('circle',{
                "cx": (Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*redius)+cirX,
                "cy": (Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*redius)+cirY,
                "fill":"red",
                "r": 2
             })
        );
        cirInfoSVG.appendChild(
            createSVGElement('line',{
                "x1": (Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*redius)+cirX,
                "y1": (Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*redius)+cirY,
                "x2": (Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(redius-10))+cirX,
                "y2": (Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(redius-10))+cirY,
                "stroke":"red",
                "id":"tLine",
                "class": "genUnderline",
             })
        );
        cirInfoSVG.appendChild(
            createSVGElement('text',{
                "x": cirX+redius+5,
                "y": cirY-0,
                //"style":`transform: rotate(${((degree/allMovies.length)*i)}deg);`, 
                "style":`transform: rotate(${((degree/allMovies.length)*i)+(offDegree)}deg); transform-origin: ${cirX}px ${cirY}px`,
                "class": "movName"
             },movie.Name)
        );
    });

    redius = 150;
    degree = 270;
    offDegree = 0;
    cirX = 250;
    cirY = 550;
    
    moviesWithGenres.slice(((moviesWithGenres.length-1)/2),(moviesWithGenres.length-1)).forEach(function(movie,i,allMovies){
        cirInfoSVG.appendChild(
            createSVGElement('circle',{
                "cx": (Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*redius)+cirX,
                "cy": (Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*redius)+cirY,
                "fill":"red",
                "r": 2
             })
        );
        cirInfoSVG.appendChild(
            createSVGElement('line',{
                "x1": (Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*redius)+cirX,
                "y1": (Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*redius)+cirY,
                "x2": (Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(redius-10))+cirX,
                "y2": (Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(redius-10))+cirY,
                "stroke":"red",
                "id":"tLine",
                "class": "genUnderline",
             })
        );
        cirInfoSVG.appendChild(
            createSVGElement('text',{
                "x": cirX+redius+5,
                "y": cirY-0,
                //"style":`transform: rotate(${((degree/allMovies.length)*i)}deg);`, 
                "style":`transform: rotate(${((degree/allMovies.length)*i)+(offDegree)}deg); transform-origin: ${cirX}px ${cirY}px`,
                "class": "movName"
             },movie.Name)
        );
    });

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