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
            if (data.length === 0) {
                // Handle empty data case
                // Kill charts if they exist
                if (window.keywordChart instanceof Chart) {
                    window.keywordChart.destroy();
                }
                if (window.newsChart instanceof Chart) {
                    window.newsChart.destroy();
                }
                // Log message to user
                resultTable.innerHTML = 'No data available';
                return;
            }
            let titles = [];
            let combinedText = '';
            // Loop through the results to create a table
            data.forEach(function(newsItem) {
                if (newsItem.headline !== 'No headline available') {
                    // Check encoding
                    let headline = fixEncoding(newsItem.headline);
                    let summary = fixEncoding(newsItem.summary);

                    // Create html elements to show headlines and summarries
                    let newsDiv = document.createElement('div');
                    newsDiv.classList.add('card', 'mb-3');

                    let cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    let headlineElem = document.createElement('h5');
                    headlineElem.classList.add('card-title');
                    headlineElem.textContent = headline;

                    let summaryElem = document.createElement('p');
                    summaryElem.classList.add('card-text');
                    summaryElem.textContent = summary;

                    cardBody.appendChild(headlineElem);
                    cardBody.appendChild(summaryElem);

                    newsDiv.appendChild(cardBody);

                    document.getElementById('result').appendChild(newsDiv);

                    titles.push(headline);
                    combinedText += `${headline} ${summary}`;
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

    // Destroy existing chart
    if (window.keywordChart instanceof Chart) {
        window.keywordChart.destroy();
    }
    let labels = keywordCounts.map(item => item[0]);
    let counts = keywordCounts.map(item => item[1]);

    window.keywordChart = new Chart(ctx, {
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
    
    // Destroy existing chart
    if (window.newsChart instanceof Chart) {
        window.newsChart.destroy();
    }
    let titleLengths = titles.map(title => title.split(' ').length);

    window.newsChart = new Chart(ctx, {
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

function fixEncoding(str) {
    // Regex to detect incorrect characters
    const incorrectCharRegex = /â|â|â¦/g;
    if (incorrectCharRegex.test(str)) {
        try {
            return decodeURIComponent(escape(str));
        } catch (e) {
            console.error('Error decoding string:', str, e);
            // Fallback to the original string if decoding fails
            return str; 
        }
    }
    return str;
}