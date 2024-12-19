const https = require('https');
const fs = require('fs');
const path = require('path');

let downloadedSurahs = 0;
const totalSurahs = 114;

async function downloadSurah(qari, surah) {
    const dir = `./${qari}`;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
        const filePath = path.join(dir, `${surah}.mp3`);
        const file = fs.createWriteStream(filePath);
        const url = `https://download.quranicaudio.com/quran/${qari}/${String(surah).padStart(3, '0')}.mp3`;

        const request = https.get(url, function (response) {
            response.pipe(file);

            file.on("finish", () => {
                file.close(() => {
                    downloadedSurahs++;
                    printProgress();
                    resolve();
                });
            });

            file.on("error", (err) => {
                fs.unlink(filePath, () => reject(err));
            });
        });

        request.on('error', (err) => {
            reject(err);
        });
    });
}

async function downloadMushaf(qari) {
    printProgress();
    await Promise.all(
        Array(totalSurahs).fill().map(async (x, i) => {
            await downloadSurah(qari, i + 1);
        })
    );

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(`Downloaded ${downloadedSurahs} surahs for ${qari}`);
}

const drawProgressBar = (progress) => {
    const barWidth = 30;
    const filledWidth = Math.floor(progress / 100 * barWidth);
    const emptyWidth = barWidth - filledWidth;
    const progressBar = '█'.repeat(filledWidth) + '▒'.repeat(emptyWidth);
    return `[${progressBar}] ${progress}%`;
}

const printProgress = () => {
    const progressPercentage = Math.floor(downloadedSurahs / totalSurahs * 100) ;
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Downloading ${drawProgressBar(progressPercentage)}`);
}

// downloadMushaf("noreen_siddiq");
// downloadMushaf("abdulbaset_warsh");

if (!process.argv[2]) {
    console.log("Please provide a qari");
    process.exit(1);
} else {
    downloadMushaf(process.argv[2]);
}