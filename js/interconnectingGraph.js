"use strict";

function drawInterConnectingGraph(){
    // Liner Connecting SVG

    const linInfoSVG = document.querySelector("#linerInfographic");
    const svgSize = { "width": 400, "height": 500 };

    //Emptying SVG container
    linInfoSVG.innerHTML = "";
    // Setting Size
    linInfoSVG.setAttribute("viewBox",`0 0 ${svgSize.width} ${svgSize.height}`);

    let totalCount = Genres.map(g => g.count).reduce((a, b) => a + b, 0);
    let maxLength = 450;
    const gap = 2;
    const rectWidth = 15;
    const topSpacing = 30;
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
                "y": topSpacing+(gap*i)+(maxLength* allGen.slice(0,i).map(g => g.count).reduce((a, b) => a + b, 0) )/totalCount,
                "width":rectWidth,
                "height": (maxLength*gen.count)/totalCount,
                "fill": gen.color,
                "data-genre-hover-i": i
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
                "y": topSpacing+(gap*i)+(maxLength* allGen.slice(0,i).map(g => g.count).reduce((a, b) => a + b, 0) )/totalCount,
                "width":(((svgSize.width/2)+10)*(averageRating-2.5))/7.5,
                "height": (maxLength*gen.count)/totalCount,
                "fill": gen.color,
                "data-genre-hover-i": i
            })
        );
        // Draw Rating bar with pattern
        linInfoSVG.appendChild(
            createSVGElement('rect',{
                "x": (svgSize.width/2)+(rectWidth/2)+2.5,
                "y": topSpacing+(gap*i)+(maxLength* allGen.slice(0,i).map(g => g.count).reduce((a, b) => a + b, 0) )/totalCount,
                "width":(((svgSize.width/2)+10)*(averageRating-2.5))/7.5,
                "height": (maxLength*gen.count)/totalCount,
                "fill": `url('#pat')`,
                "data-genre-hover-i": i
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
                        let genTopOffset = topSpacing+parseFloat(( (gap*genI)
                            + ( maxLength * allGen
                                .slice(0,genI).map(g => g.count)
                                .reduce((a, b) => a + b, 0) 
                            ) / totalCount ).toFixed(2));
                        
                        let tGenLength = parseFloat(((maxLength*thisGen.count)/totalCount).toFixed(2)); 
                        let tGenTopOffset = topSpacing+parseFloat(( (gap*thisI)
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

    // Drawing connection Path
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
                                (svgSize.width/1.5)
                                // Ideal ((svgSize.width/2)-(rectWidth/2)-2.5) 
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
                        C   ${xPoint4Cur}, ${topOffset},
                            ${xPoint4Cur}, ${tGenTopOffset+tConnectLength},
                            ${xPoint}, ${tGenTopOffset+tConnectLength}
                        V ${tGenTopOffset}
                        C   ${xPoint4Cur+curWidth}, ${tGenTopOffset},
                            ${xPoint4Cur+curWidth}, ${topOffset+sConnectLength},
                            ${xPoint}, ${topOffset+sConnectLength}
                        V ${topOffset}
                    `,
                    "fill": fillColor,
                    "opacity": .75,
                    "data-genre-i": sGenI
                })
            );               
    });

    /// Mouse Hover 
    
    linInfoSVG.querySelectorAll('[data-genre-hover-i]').forEach(thisElement => {
        // Genres info container
        let genInfo = document.querySelector("#genInfo");

        thisElement.addEventListener('mouseover', function(e){
            linInfoSVG.querySelectorAll('[data-genre-hover-i], [data-genre-i]')
            .forEach(onOfElement => {

                if(onOfElement.dataset.genreI == thisElement.dataset.genreHoverI || 
                    onOfElement.dataset.genreHoverI == thisElement.dataset.genreHoverI){
                    onOfElement.style.opacity = 1; }
                else {
                    onOfElement.style.opacity = 0.025; }
            });
                    
            genresInterConnecting
                .filter(([gI,tGI]) => (gI == thisElement.dataset.genreHoverI || tGI == thisElement.dataset.genreHoverI ))
                .forEach(([,gI]) => {
                    linInfoSVG.querySelectorAll(`[data-genre-hover-i="${gI}"]`)
                    .forEach(e => {
                        e.style.opacity = 1;
                    });
                });

            let thisGen = Genres[thisElement.dataset.genreHoverI];
            genInfo.querySelector("h4").innerHTML = `
                    <strong style="background-color:${thisGen.color}"></strong>
                    ${thisGen.Name}`;

            genInfo.querySelector("ul").innerHTML = ``;
            genresInterConnecting
                .filter(([gI]) => (gI == thisElement.dataset.genreHoverI))
                .reverse()
                .forEach(([,tGI]) => {
                    let thisGen = Genres[tGI];
                    genInfo.querySelector("ul").innerHTML 
                        += `<li>
                                <strong style="background-color:${thisGen.color}"></strong>
                                ${thisGen.Name}
                            </li>`;
                });
            let docWidth = document.body.clientWidth;
            genInfo.style.cssText = `
                display: flex;
                top: ${e.clientY+20}px;
                left: ${
                    (e.clientX+20) > (docWidth-400) ?
                    (docWidth-400) : (e.clientX+20)
                }px;
            `;
        });

        thisElement.addEventListener('mouseout', function(){
            linInfoSVG.querySelectorAll('[data-genre-hover-i], [data-genre-i]')
            .forEach(onOfElement => {
                onOfElement.style.opacity = 1;
            });
            genInfo.style.display = `none`;
        });
    });

    // Drawing Measuring lines
    linInfoSVG.appendChild(
        createSVGElement('rect',{
            "x": (svgSize.width/2)+(rectWidth/2)+2.5,
            "y": topSpacing-5,
            "width":(svgSize.width/2),
            "height": 1,
            "fill": '#FFF'
        })
    );
    for(let i = 5; i >= 0; i--){
        linInfoSVG.appendChild(
            createSVGElement('rect',{
                "x": ((svgSize.width/2)+(rectWidth/2)+2.5)
                    +((((svgSize.width/2)-(rectWidth/2))/5)*(i)),
                "y": (topSpacing-5)-8,
                "width":.25,
                "height": svgSize.height - 30,
                "fill": '#FFF'
            })
        );    
        linInfoSVG.appendChild(
            createSVGElement('text',{
                "x": ((svgSize.width/2)+(rectWidth/2)+2.5)
                    +((((svgSize.width/2)-(rectWidth/2))/5)*(i))+5,
                "y": (topSpacing-5)-3,
                "class": 'smallText'
            }, i*2)
        );
    }

    linInfoSVG.appendChild(
        createSVGElement('text',{
            "x": (svgSize.width/4)-40,
            "y": 6,
            "class": 'mediumText'
        }, 'Interconnecting Genres')
    );
    
    linInfoSVG.appendChild(
        createSVGElement('text',{
            "x": ((svgSize.width/4)*3)-30,
            "y": 6,
            "class": 'mediumText'
        }, 'Genres Ratings')
    );

    linInfoSVG.appendChild(
        createSVGElement('rect',{
            "x": 0,
            "y": (topSpacing-5)-8,
            "width":.25,
            "height": svgSize.height - 30,
            "fill": '#FFF'
        })
    );
    
    linInfoSVG.appendChild(
        createSVGElement('rect',{
            "x": (svgSize.width/2)-(rectWidth/2)-2.5,
            "y": (topSpacing-5)-8,
            "width":.25,
            "height": svgSize.height - 30,
            "fill": '#FFF'
        })
    );
    linInfoSVG.appendChild(
        createSVGElement('rect',{
            "x": 0,
            "y": topSpacing-5,
            "width":(svgSize.width/2)-(rectWidth/2)-2.5,
            "height": 1,
            "fill": '#FFF'
        })
    );

}