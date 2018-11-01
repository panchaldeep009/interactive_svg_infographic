"use strict";

var MovieData = [];
var detailData = [];

function DataFetch(callBack){
    // Get Top Movies List
    fetch('data/detailedMoviesInfo.json')
        .then(res => res.json())
        .then((out) => {
            MovieData = out;
            if(callBack != null){ callBack(); }
        })
        .catch(err => { 
            console.log(err);

            // On Data not found;
            
            
            fetch('data/topMoviesInfo.json')
                .then(res => res.json())
                .then(async function(out){
                    out.forEach(function(movie,i,allMovie){
                        detailM(movie,i,allMovie,
                            // call back
                            async function(){
                            await sendToJson(detailData);
                            console.log(detailData.length);
                            MovieData = detailData;
                            if(callBack != null){ callBack(); }
                        });
                    });
                })
                .catch(err => { console.error(err) });
        });
}

function detailM(movie,i,allMovie,callBack){
    fetch(`http://www.omdbapi.com/?apikey=58fd2c82&t=${movie.name}&y=${movie.year}`)
        .then(res => res.json())
        .then((out) => {
            detailData.push(out);
            if (i >= (allMovie.length-1)){
                if(callBack != null){ callBack(); }
            }
        })
        .catch(err => { 
            console.log(err);
        });
}
function sendToJson(data) {
    var postData = new FormData();
    postData.append( "json", JSON.stringify( data ) );
    fetch(`php/postToJson.php`, {
        method: "POST",
        body: postData // body data type must match "Content-Type" header
    })
    .then(response => console.log('Success:', response))
    .catch(error => console.error('Error:', error));
}