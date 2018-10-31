"use strict";
(() => {

    //// Circular Connecting InfoGraphic SVG
    // SVG container
    const cirInfoSVG = document.querySelector("#circularInfographic");
    // Size of container
    const svgSize = { "width": 600, "height": 700 };

    // Function to draw Flower type infoGraphic
    drawCirInfoGData(cirInfoSVG,svgSize,300,400,195,360,50,5,55,270,moviesInfo.slice(0));
    // drawCirInfoGData ( SVG Container, Flower X, Y, Radius, Deg, offDeg, total leafs, leaf Radius, leaf Deg, Data)
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
            let movieData = moviesInfo.find(m => (m.Name == thisElement.dataset.hoverMovie));
            
            movieInfo.querySelector("img").src = movieData.Poster;
            movieInfo.querySelector("h4").innerHTML = movieData.Name;
            movieInfo.querySelector("span").innerHTML = movieData.Year;
            movieInfo.querySelector("p").innerHTML = movieData.Plot;
            movieInfo.querySelector("ul").innerHTML = "";
            movieData.genres.forEach(gen => {
                let thisGen = Genres.find(g => (g.Name == gen));
                movieInfo.querySelector("ul").innerHTML 
                    += `<li>
                            <strong style="background-color:${thisGen.color}"></strong>
                            ${thisGen.Name}
                        </li>`;
            });

            let docWidth = document.body.clientWidth;
            movieInfo.style.cssText = `
                display: flex;
                top: ${e.clientY+20}px;
                left: ${
                    (e.clientX+20) > (docWidth-400) ?
                    (docWidth-400) : (e.clientX+20)
                }px;
            `;
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

})();