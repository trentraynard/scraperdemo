function fetchScrapeData(url) {
    fetch('scraper.php?url='+url)
        .then(function(response) {
            // Convert the response to JSON
            return response.json();    
        })
        .then(function(data) {
            // Clear previous news data if it exists
            let resultTable = document.getElementById('result');
            resultTable.innerHTML = '';
            let titles = [];
            let combinedText = '';
            // Loop through the results to create a table
            data.forEach(function(newsItem) {
                if (newsItem.headline !== 'No headline available') {
                    // Create html elements to show headlines and summarries
                    let newsDiv = document.createElement('div');
                    newsDiv.classList.add('card', 'mb-3');

                    let cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    let headline = document.createElement('h5');
                    headline.classList.add('card-title');
                    headline.textContent = newsItem.headline;

                    let summary = document.createElement('p');
                    summary.classList.add('card-text');
                    summary.textContent = newsItem.summary;

                    cardBody.appendChild(headline);
                    cardBody.appendChild(summary);

                    newsDiv.appendChild(cardBody);

                    document.getElementById('result').appendChild(newsDiv);

                    titles.push(newsItem.headline);
                    combinedText += `${newsItem.headline} ${newsItem.summary}`;
                }
            });
            let kewordCounts = getKeywordCounts(combinedText);
            createKeywordChart(kewordCounts);
            createTitleChart(titles);

        })
        .catch(function(error){
            // Log errors
            console.error('Error fetching news:', error);
        });

}

function getKeywordCounts(text) {
    let words = text.toLowerCase().split(/\W+/);
    let keywordCounts = {};
    let stopWords = new Set(['the', 'summary', 'and', 'of', 'to', 'a', 'in', 'that', 'it', 'is', 'was', 'i', 'for', 'on', 'you', 'with', 'as', 'he', 'be', 'at', 'by', 'an', 'this', 'not', 'but', 'are', 'or', 'from']);

    words.forEach(word => {
        if (word.length > 2 && !stopWords.has(word)) {
            keywordCounts[word] = (keywordCounts[word] || 0) + 1;
        }
    });

    let sortedKeywords = Object.entries(keywordCounts).sort((a, b) => b[1] - a[1]);
    return sortedKeywords.slice(0, 10);
}

function createKeywordChart(keywordCounts) {
    let ctx = document.getElementById('keywordChart').getContext('2d');
    let labels = keywordCounts.map(item => item[0]);
    let counts = keywordCounts.map(item => item[1]);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Keyword Count',
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}



function createTitleChart(titles) {
    let ctx = document.getElementById('newsChart').getContext('2d');
    let titleLengths = titles.map(title => title.split(' ').length);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: titles.slice(0, 10), // Display only first 10 titles
            datasets: [{
                label: '# of Words in Title',
                data: titleLengths.slice(0, 10),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}