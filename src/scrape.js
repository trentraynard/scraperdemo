function fetchScrapeData(url) {
    fetch('scraper.php?url='+url)
        .then(function(response) {
            // Convert the response to JSON
            return response.json();    
        })
        .then(function(data) {
            // Clear previous news data if it exists
            var resultTable = document.getElementById('result');
            resultTable.innerHTML = '';

            // Loop through the results to create a table
            data.forEach(function(newsItem) {
                if (newsItem.headline !== 'No headline available') {
                    // Create html elements to show headlines and summarries
                    var newsDiv = document.createElement('div');
                    newsDiv.classList.add('card', 'mb-3');

                    var cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    var headline = document.createElement('h5');
                    headline.classList.add('card-title');
                    headline.textContent = newsItem.headline;

                    var summary = document.createElement('p');
                    summary.classList.add('card-text');
                    summary.textContent = newsItem.summary;

                    cardBody.appendChild(headline);
                    cardBody.appendChild(summary);

                    newsDiv.appendChild(cardBody);

                    document.getElementById('result').appendChild(newsDiv);
                }
            });
        })
        .catch(function(error){
            // Log errors
            console.error('Error fetching news:', error);
        });

}