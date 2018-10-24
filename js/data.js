"use strict";
(() => {
    // Get Top Movies List
    var detailData = [];

    fetch('data/topMoviesInfo.json')
        .then(res => res.json())
        .then((out) => {
            out.forEach(movie => {
                fetch(`http://www.omdbapi.com/?apikey=58fd2c82&t=${movie.name}&y=${movie.year}`)
                    .then(res => res.json())
                    .then((out) => {
                        detailData.push(out);
                    })
                    .catch(err => { console.error(err) });
            });
            setTimeout(() => {
                sendToJson(detailData);
            }, 5000);
        })
        .catch(err => { console.error(err) });
    
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

})();