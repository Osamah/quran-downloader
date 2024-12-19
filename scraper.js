const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs').promises;

function getPage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';
            
            if (response.statusCode >= 300 && response.statusCode < 400) {
                getPage(response.headers.location)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                resolve(data);
            });

        }).on('error', (error) => {
            reject(error);
        });
    });
}

function extractQariId(downloadLink) {
    const match = downloadLink.match(/quran\/([^/]+)\/\d+\.mp3/);
    return match ? match[1] : null;
}

async function scrapeQuranAudio() {
    const results = [];
    
    for (let i = 1; i <= 250; i++) {
        try {
            console.log(`Scraping page ${i}...`);
            
            const url = `https://quranicaudio.com/quran/${i}`;
            const html = await getPage(url);
            const $ = cheerio.load(html);
            
            const downloadLink = $('a[href*="download.quranicaudio.com"]').attr('href');
            
            if (downloadLink) {
                const qariId = extractQariId(downloadLink);
                if (qariId) {
                    results.push(qariId);
                    console.log(`Found qari ID: ${qariId}`);
                }
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error(`Error scraping page ${i}:`, error.message);
        }
    }
    
    try {
        await fs.writeFile('qari_ids.json', JSON.stringify(results, null, 2));
        console.log('Results saved to qari_ids.json');
    } catch (error) {
        console.error('Error saving results:', error.message);
    }
}

scrapeQuranAudio().catch(console.error);