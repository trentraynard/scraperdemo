<?php

function fetchHtml($url) {
    // Set up curl 
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
    $userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0"
    ];
    // Get random user agent
    $userAgent = $userAgents[rand(0,count($userAgents)-1)];
    curl_setopt($curl, CURLOPT_USERAGENT, $userAgent);
    // Set up Referer
    curl_setopt($curl, CURLOPT_REFERER, 'https://www.google.com');
    // Set up mimic headers
    curl_setopt($curl, CURLOPT_HTTPHEADER, [
        'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language: en-US,en;q=0.5',
        'Connection: keep-alive',
        'Cache-Control: no-cache'
    ]);
    // Set up delay
    curl_setopt($curl, CURLOPT_PROGRESSFUNCTION, function() {
        usleep(100000);
        return 0;
    });
    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);
    // Log response and return result
    if ($err) {
        return ['error' => 'cURL error: ' . $err];
    } else {
        return $response;
    }
    
}

function scrapeSite($url) {
    //check for parameter
    if (!filter_var($url, FILTER_VALIDATE_URL)) {
        return ['error' => 'Invalid URL'];
    }
    // Call curl
    $url = fetchHtml($url);
    // set up dom
    $dom = new DOMDocument();
    // supress warnings 
    @$dom->loadHTML($url);

    $articles = [];
    $articleTags = $dom->getElementsByTagName('article');
    foreach ($articleTags as $articleTag) {
        $headTag = $articleTag->getElementsByTagName('h3')->item(0);
        $summaryTag = $articleTag->getElementsByTagName('p')->item(0);

        $summary = $summaryTag ? trim($summaryTag->textContent) : null;
        // check for summary in div if not in p (OC reg)
        if (!$summary) {
            $divTags = $articleTag->getElementsByTagName('div');
            foreach ($divTags as $divTag) {
                if ($divTag->getAttribute('class') === 'excerpt') {
                    $summary = trim($divTag->textContent);
                }
            }
        }
        // check for subscriber only header
        $headline = $headTag ? trim($headTag->textContent) : 'No headline available';
        if ($headline === 'SUBSCRIBER ONLY') {
            $nextTag = $articleTag->getElementsByTagName('h3')->item(1);
            $headline = trim($nextTag->textContent);
        }

        $summary = $summary ? $summary : 'No summary available';
        $articles[] = ['headline' => $headline, 'summary' => $summary];
    }
    
    return $articles;
}

// Handle request
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['url'])) {
    $url = $_GET['url'];
    header('Content-Type: application/json');
    echo json_encode(scrapeSite($url));
}
