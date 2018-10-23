<?php
    $file = '../data/detailedMoviesInfo.json';
    $json = $_POST;
    file_put_contents($file, $json);
?>