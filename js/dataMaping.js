"use strict";

var Genres = [];
var moviesInfo = [];

(() => {
    var differentColors = [
        "#e6194B","#3cb44b","#ffe119","#4363d8","#f58231",
        "#e6beff","#42d4f4","#f032e6","#bfef45","#fabebe",
        "#469990","#911eb4","#9A6324","#fffac8","#800000",
        "#aaffc3","#808000","#ffd8b1","#000075","#a9a9a9",
        "#ffffff","#000000"
    ];
    // Find all Genres and Title
    MovieData.forEach(thisMovie => {
        if(thisMovie.Response != "False"){
            thisMovie.Genre.split(', ').forEach(function (thisGenre,i){
                if (Genres.filter(g => g.Name === thisGenre).length <= 0) {
                    Genres.push({"Name": thisGenre, "count": 1, "color": differentColors[Genres.length]});
                } else {
                    Genres.map(g => { if(g.Name === thisGenre){ g.count++; } });
                }
            });
            moviesInfo.push({
                "Name": thisMovie.Title,
                "Year": thisMovie.Year,
                "genres": thisMovie.Genre.split(', '),
                "imdbRating": thisMovie.imdbRating,
                "Poster":thisMovie.Poster,
                "Plot":thisMovie.Plot});
        }
    });

    // Sort Genres By it's coming
    Genres = Genres.sort(function(a,b) { return b.count - a.count });
    moviesInfo = moviesInfo.sort(
        function () { return Math.floor(Math.random()*3)-1; }
    );
    console.log(moviesInfo.length);
})();