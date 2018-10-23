"use strict";
(() => {
    // Find all Genres
    var Genres = [];
    MovieData.forEach(thisMovie => {
        if(thisMovie.Response != "False"){
            thisMovie.Genre.split(', ').forEach(thisGenre =>{
                if(!Genres.includes(thisGenre)){ Genres.push(thisGenre); }
            });
        }
    });
    console.log(Genres);
})();