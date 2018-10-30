"use strict";
(() => {
    //// Circular Connecting InfoGraphic SVG
    // SVG container
    var cirInfoSVG = document.querySelector("#circularInfographic");
    // Size of container
    var svgSize = { "width": 600, "height": 700 };

    // Function to draw Flower type infoGraphic
    drawCirInfoGData(cirInfoSVG,svgSize,300,400,195,360,50,5,55,270,moviesInfo.slice(0));
    // drawCirInfoGData ( SVG Container, Flower X, Y, Radius, Deg, offDeg, total leafs, leaf Radius, leaf Deg, Data) (fun on line : 98)
    function drawCirInfoGData(cirInfoSVG,svgSize,fX,fY,fR,fDeg,fOffDeg,leafs,lR,lDeg,data){
        //Emptying SVG container
        cirInfoSVG.innerHTML = "";
        // Setting Size
        cirInfoSVG.setAttribute("viewBox",`0 0 ${svgSize.width} ${svgSize.height}`);
        // split data based on number of leafs 
        var splitData = [];
        for (let i = leafs; i > 0; i--) {
            splitData.push(data.splice(0, Math.ceil(data.length / i)));
        }

        // draw circle for each leaf based on split data 
        splitData.forEach(function(data,i){
            // finding position of a leaf circle based radius of flower and total number of leafs
            let cirX = (Math.cos((((fDeg/leafs)*i)+(fOffDeg)) * Math.PI / 180.0)*fR)+fX;
            let cirY = (Math.sin((((fDeg/leafs)*i)+(fOffDeg)) * Math.PI / 180.0)*fR)+fY;

            // dataToCircle(SVG,data,subData,cirX,cirY,radius,degree,offDegree,flowerX,flowerY)
            dataToCircle(cirInfoSVG,data,Genres,
                cirX,cirY,lR,lDeg,fOffDeg+(lDeg-45)+((fDeg/leafs)*i)+5,
                fX,fY);
        });

        // to find maximum number of most use genre in all movies
        let maxGenCount = Math.max(...Genres.map(g => g.count));
        
        // Count all genres
        let allSum = 0;
        Genres.map(g => g.count).forEach(c => {
            // averageRadius : to find radius of genre circle from it's count (fun on line : 95)
            allSum += averageRadius(c,maxGenCount,20); 
        });

        // throw each Genres of all movies
        Genres.forEach(function(genre,genI,allGen){

            // List Genres on top
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

            // List circles and colors of Genres on top
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
            
            //count previous genres radius to left space on left
            let sumOfLast = 0;
            allGen.slice(0,genI+1).map(g => g.count).forEach(c => {
                // averageRadius : to find radius of genre circle from it's count (fun on line : 95)
                sumOfLast += averageRadius(c,maxGenCount,20); 
            });

            // Draw circle of genre based on it's count
            cirInfoSVG.appendChild(
                createSVGElement('circle',{
                    "cx": (fX-(allSum))+(sumOfLast*1.8),
                    "cy": fY,
                    "fill":genre.color,
                    "data-genre":genre.Name,
                    "data-hover-genre":genre.Name,
                    "r": averageRadius(genre.count,maxGenCount,20)
                })
            );       
        });
    }

    // averageRadius : to find radius of genre circle from it's count
    function averageRadius(c,max,p){ return (Math.round((p*c/max) < 2 ? 2 : (p*c/max)))}
    
    // function to draw leaf circle
    function dataToCircle(cirInfoSVG,movieData,Genres,cirX,cirY,radius,degree,offDegree,pX,pY){
        // Get throw Each movie
        movieData.forEach(function(thisData,i,allMovies){
            // Get throw all genres of this movie
            thisData.genres.forEach(function(thisGenre,thisI){

                // Get maximum number of most use genre in all movies
                let maxGenCount = Math.max(...Genres.map(g => g.count));
                
                // Count all genres
                let allSum = 0;
                Genres.map(g => g.count).forEach(c => { 
                    // averageRadius : to find radius of genre circle from it's count (fun on line : 95)
                    allSum += averageRadius(c,maxGenCount,20); 
                });
                
                // throw all genres of all movie
                Genres.forEach(function(genre,genI,allGen){
                    // find this movie genre match with genres list
                    if(genre.Name == thisGenre){
                        //count previous genres radius to left space on left
                        let sumOfLast = 0;
                        allGen.slice(0,genI+1).map(g => g.count).forEach(c => { sumOfLast += averageRadius(c,maxGenCount,20); });

                        // find this genres circle radius 
                        let genRadius = averageRadius(genre.count,maxGenCount,20);

                        // find random position for connecting line within this genres radius
                        let randomToleranceX = (Math.floor(Math.random() * genRadius) -(genRadius/2) );
                        let randomToleranceY = (Math.floor(Math.random() * genRadius) -(genRadius/2) );

                        // drawing connecting line from this movie genres to main Genres
                        cirInfoSVG.appendChild(
                            createSVGElement('path',{
                                "d": `M ${(pX-(allSum)+randomToleranceX)+(sumOfLast*1.8)},${pY+randomToleranceY}
                                        C ${cirX},${cirY},
                                            ${(Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(radius-(20)))+cirX},
                                            ${(Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(radius-(20)))+cirY},
                                            ${(Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(radius-(5*thisI)))+cirX},
                                            ${(Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(radius-(5*thisI)))+cirY},`,
                                "stroke":genre.color,
                                "data-genre":genre.Name,
                                "data-movie":thisData.Name,
                                "class": "conntLine"
                            })
                        );

                        // drawing this movie genre circle
                        cirInfoSVG.appendChild(
                            createSVGElement('circle',{
                                "cx": (Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(radius-(5*thisI)))+cirX,
                                "cy": (Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(radius-(5*thisI)))+cirY,
                                "fill":genre.color,
                                "data-genre":genre.Name,
                                "data-movie":thisData.Name,
                                "r": 2
                            })
                        );
                    }
                });
            });

            // drawing pointing line from genres circle to movie name
            cirInfoSVG.appendChild(
                createSVGElement('line',{
                    "x1": (Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(radius+3))+cirX,
                    "y1": (Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(radius+3))+cirY,
                    "x2": (Math.cos((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(radius+8))+cirX,
                    "y2": (Math.sin((((degree/allMovies.length)*i)+(offDegree)) * Math.PI / 180.0)*(radius+8))+cirY,
                    "stroke":"red",
                    "id":"tLine",
                    "class": "genUnderline",
                })
            );

            // movie name 
            cirInfoSVG.appendChild(
                createSVGElement('text',{
                    "x": cirX+radius+8,
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
    //end of Function : dataToCircle

    /// Mouse Events

    // On hover genre element 
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

    // On hover movie names
    cirInfoSVG.querySelectorAll('[data-hover-movie]').forEach(thisElement => {
        // movie info container
        let movieInfo = document.querySelector("#movieInfo");

        thisElement.addEventListener('mouseover', function(e){
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

            // change movies info
            let movieData = moviesInfo.filter(m => (m.Name == thisElement.dataset.hoverMovie))[0];

            movieInfo.querySelector("img").src = movieData.Poster;
            movieInfo.querySelector("h4").innerHTML = movieData.Name;
            movieInfo.querySelector("span").innerHTML = movieData.Year;
            movieInfo.querySelector("p").innerHTML = movieData.Plot;

            
            movieInfo.style.display = 'flex';
            movieInfo.style.display = 'flex';
            movieInfo.style.top = e.clientY+20+'px';

            let docWidth = document.body.clientWidth;
            movieInfo.style.left =
                (e.clientX+20) > (docWidth-400) ?
                (docWidth-400) : (e.clientX+20)
            +'px';
        });

        thisElement.addEventListener('mouseout', function(){
            cirInfoSVG.querySelectorAll('[data-movie]').forEach(oneOfElement => {
                oneOfElement.style.opacity = 1;
            });
            cirInfoSVG.querySelectorAll('[data-hover-genre]').forEach(oneOfElement => {
                oneOfElement.style.opacity = 1;
            });
            movieInfo.style.display = 'none';
            movieInfo.querySelector("img").src = 'images/poster.jpg';
        });
    });

    // Liner Connecting SVG

    var linInfoSVG = document.querySelector("#linerInfographic");
    svgSize = { "width": 400, "height": 500 };

    //Emptying SVG container
    linInfoSVG.innerHTML = "";
    // Setting Size
    linInfoSVG.setAttribute("viewBox",`0 0 ${svgSize.width} ${svgSize.height}`);

    let totalCount = Genres.map(g => g.count).reduce((a, b) => a + b, 0);
    let maxLength = 450;
    let gap = 2;
    let rectWidth = 15;
    maxLength = maxLength - Genres.length*gap;

    // insert pattern
    linInfoSVG.innerHTML += 
    `<defs>
        <pattern id="pat" 
        width="4" height="4"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)">
            <rect x="0" y="0" width=".75" height="4" fill="#fff" fill-opacity=".7"></rect>
            <rect x="0" y="0" width="4" height=".75" fill="#555" fill-opacity=".7"></rect>
        </pattern>
    </defs>`;

    Genres.forEach(function(gen,i,allGen){
        // Genre rectangle
        linInfoSVG.appendChild(
            createSVGElement('rect',{
                "x": (svgSize.width/2)-(rectWidth/2),
                "y": (gap*i)+(maxLength* allGen.slice(0,i).map(g => g.count).reduce((a, b) => a + b, 0) )/totalCount,
                "width":rectWidth,
                "height": (maxLength*gen.count)/totalCount,
                "fill": gen.color
            })
        );
        // Select all movies of this genres and get average ratting
        let averageRating = (
            moviesInfo.filter(movie => movie.genres.includes(gen.Name))
                .map(m => parseFloat(m.imdbRating))
                .reduce(function(a, b) { return a + b; }) / gen.count
            ).toFixed(1);
        // Draw Rating bar with color
        linInfoSVG.appendChild(
            createSVGElement('rect',{
                "x": (svgSize.width/2)+(rectWidth/2)+2.5,
                "y": (gap*i)+(maxLength* allGen.slice(0,i).map(g => g.count).reduce((a, b) => a + b, 0) )/totalCount,
                "width":(((svgSize.width/2)+10)*(averageRating-2.5))/7.5,
                "height": (maxLength*gen.count)/totalCount,
                "fill": gen.color
            })
        );
        // Draw Rating bar with pattern
        linInfoSVG.appendChild(
            createSVGElement('rect',{
                "x": (svgSize.width/2)+(rectWidth/2)+2.5,
                "y": (gap*i)+(maxLength* allGen.slice(0,i).map(g => g.count).reduce((a, b) => a + b, 0) )/totalCount,
                "width":(((svgSize.width/2)+10)*(averageRating-2.5))/7.5,
                "height": (maxLength*gen.count)/totalCount,
                "fill": `url('#pat')`
            })
        );
    });
    

    // To generate genres connecting pair

    let genresInterConnecting = [];
    //genresInterConnecting = [ thisGenre Index, connectedGenre Index, total connection, lengthOfGenre, topOffSet]
    let maxGenresLengthPerMovie = Math.max(...moviesInfo
        .map(movie => movie.genres.length));

    Genres.forEach(function(gen,genI,allGen){
        allGen.forEach(function(thisGen,thisI){
            for(var i = 0; i < maxGenresLengthPerMovie; i++){
                let thisGenMovie = moviesInfo
                    .filter(movie => (movie.genres.length > (i+1)))
                    .filter(movie => movie.genres[i].includes(gen.Name))
                    .filter(movie => movie.genres[i+1].includes(thisGen.Name));
                if(thisGenMovie.length > 0){
                    let existConnectingPair = genresInterConnecting
                        .filter(([sGenI, eGenI]) => (sGenI == genI && eGenI == thisI));
                    if(existConnectingPair.length > 0){
                        existConnectingPair[0][2] += thisGenMovie.length;
                    } else {
                        let genLength = parseFloat(((maxLength*gen.count)/totalCount).toFixed(2)); 
                        let genTopOffset = parseFloat(( (gap*genI)
                                            + ( maxLength * allGen
                                                .slice(0,genI).map(g => g.count)
                                                .reduce((a, b) => a + b, 0) 
                                            ) / totalCount ).toFixed(2));
                        
                        let tGenLength = parseFloat(((maxLength*thisGen.count)/totalCount).toFixed(2)); 
                        let tGenTopOffset = parseFloat(( (gap*thisI)
                                            + ( maxLength * allGen
                                                .slice(0,thisI).map(g => g.count)
                                                .reduce((a, b) => a + b, 0) 
                                            ) / totalCount ).toFixed(2));
                        genresInterConnecting.push([ genI, thisI, thisGenMovie.length, genLength, genTopOffset, tGenLength, tGenTopOffset]);
                    }
                }
            }
        });
        
    });
    
    genresInterConnecting
        .sort(function(a,b) { return b[1] - a[1] } )
        .filter(([a,b]) => (a > b))
        .concat(
            genresInterConnecting.filter(([a,b]) => (a < b))
        )
        .forEach(function(
        [sGenI,tGenI,tCount,genLength,topOffset,tGenLength,tGenTopOffset]
        ,i,allConnection){

            let sConnectCount = allConnection
                .filter(([sI,tI]) => (sI == sGenI || tI == sGenI))
                .map(count => count[2])
                .reduce((a, b) => a + b, 0);
            let sConnectLength = (tCount*genLength)/sConnectCount;
            
            let tConnectCount = allConnection
                .filter(([sI,tI]) => (sI == tGenI || tI == tGenI))
                .map(count => count[2])
                .reduce((a, b) => a + b, 0);
            let tConnectLength = (tCount*tGenLength)/tConnectCount;

            let xPoint = (svgSize.width/2)-(rectWidth/2)-2.5;
            let xPoint4Cur = ((svgSize.width/2)-(rectWidth/2)-2.5) -
                            (
                                Math.abs(topOffset - tGenTopOffset ) *
                                ((svgSize.width/2)-(rectWidth/2)-2.5) 
                            ) / (maxLength);
            let fillColor = Genres[sGenI].color;

            let curWidth = 
                    Math.abs(sConnectLength - tConnectLength) + 
                    (tConnectLength < sConnectLength ? tConnectLength : sConnectLength);
            curWidth = sGenI < tGenI ? curWidth : (-curWidth);

            let sOffTop = allConnection
                .slice(0,i)
                .filter(([genI]) => (genI == sGenI))
                .map(c => c[2])
                .reduce((a, b) => a + b, 0);
                sOffTop = (sOffTop*genLength)/sConnectCount;
                topOffset = sOffTop + topOffset;

            let tOffTop = (allConnection
                .filter(([genI]) => (genI == tGenI))
                .map(c => c[2])
                .reduce((a, b) => a + b, 0)) +
                (allConnection
                    .slice(0,i)
                    .filter(([,tGen]) => (tGen == tGenI))
                    .map(c => c[2])
                    .reduce((a, b) => a + b, 0)
                );
                tOffTop = (tOffTop*tGenLength)/tConnectCount;
                tGenTopOffset = tOffTop + tGenTopOffset;

            linInfoSVG.appendChild(
                createSVGElement('path',{
                    "d": `
                        M ${xPoint} ${topOffset}
                        C ${xPoint4Cur}, ${topOffset},
                          ${xPoint4Cur}, ${tGenTopOffset+tConnectLength},
                          ${xPoint}, ${tGenTopOffset+tConnectLength},
                        V ${tGenTopOffset}
                        C ${xPoint4Cur+curWidth}, ${tGenTopOffset},
                          ${xPoint4Cur+curWidth}, ${topOffset+sConnectLength},
                          ${xPoint}, ${topOffset+sConnectLength},
                    `,
                    "fill": fillColor,
                    "opacity": .75
                })
            );               
    });




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

})();