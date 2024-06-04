# scraperdemo
Nginx server 
PHP backend to scrape targeted sites (currently https://www.ocregister.com/ & https://www.news.com.au/)
JS fetch from PHP, sort results and display data
Unit Test (PHP Unit and mocha/chai)


# TO RUN
1.) Clone Repo to local 

2.) Build container
docker-composer up --build

3.) Connect to local host port 8080
http://localhost:8080


# Tests
PHP Unit Test
1.) Find container tag name 
2.) run command :
    docker run --rm -v $(pwd)/src:/var/www/html/src -v $(pwd)/tests:/var/www/html/tests `(container name)` phpunit --testdox /var/www/html/tests/test.php
