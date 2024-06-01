<?php
//curl to get html
function get_html($url) {
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HEADER, ['accept: application/json']);
    $html = curl_exec($curl);
    curl_close($curl);
    return $html;
}

