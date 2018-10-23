"use strict";
(() => {
    // Find all Genres
    var Genres = [];
    MovieData.forEach(thisMovie => {
        if(thisMovie.Response != "False"){
            thisMovie.Genre.split(', ').forEach(thisGenre =>{
                if (Genres.filter(g => g.Name === thisGenre).length <= 0) {
                    Genres.push({"Name": thisGenre, "count": 1});
                } else {
                    Genres.map(g => { if(g.Name === thisGenre){ g.count++; } });
                }
            });
        }
    });
    
    // Sort Genres By it's coming
    Genres = Genres.sort(function(a,b) { return b.count - a.count });

    console.log(Genres);
})();