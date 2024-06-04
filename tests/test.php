<?php

require_once __DIR__ . '/../scraper.php'; // Adjust the path to your script

// Test fetchHtml with a valid URL
function testFetchHtmlValidUrl() {
    // Mock a valid URL response
    $url = 'http://google.com';
    $response = fetchHtml($url);

    // Assert that the response is not an error
    PHPUnit\Framework\Assert::assertIsString($response);
    PHPUnit\Framework\Assert::assertStringContainsString('<html', $response);
}

// Test fetchHtml with an invalid URL
function testFetchHtmlInvalidUrl() {
    // Mock an invalid URL response
    $url = 'http://invalid-url';
    $response = fetchHtml($url);

    // Assert that the response is an error
    PHPUnit\Framework\Assert::assertIsArray($response);
    PHPUnit\Framework\Assert::assertArrayHasKey('error', $response);
}
// Test scrapeSite with an invalid URL
function testScrapeSiteInvalidUrl() {
    $url = 'invalid-url';
    $response = scrapeSite($url);

    // Assert that the response is an error
    PHPUnit\Framework\Assert::assertIsArray($response);
    PHPUnit\Framework\Assert::assertArrayHasKey('error', $response);
}

// Run the tests
testFetchHtmlValidUrl();
testFetchHtmlInvalidUrl();
testScrapeSiteInvalidUrl();

echo "All tests executed successfully.";
