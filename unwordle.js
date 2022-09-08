const { mkdirSync, existsSync } = require('fs');
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const findAnswer = require("./findanswer");

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 800,
        height: 600,
        deviceScaleFactor: 2,
    });

    // ensure recordings directory exists
    if (!existsSync('./recordings')) {
        mkdirSync('./recordings');
    }

    const recorder = new PuppeteerScreenRecorder(
        page,
        {
            fps: 60,
            followNewTab: false,
            videoFrame: {
                width: 800,
                height: 600,
            }
        }
    );
    const now = new Date();
    const recordingName = `recording-${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}.mp4`;
    await recorder.start(`./recordings/${recordingName}`);

    await page.goto('https://www.nytimes.com/games/wordle/index.html', {
        waitUntil: "networkidle2"
    });

    // trigger modal close
    await page.click('[data-testid="icon-close"]')

    // wait for modal to go away
    while (true) {
        const hasModal = !!(await page.$('[data-testid="modal-overlay"]'));
        if (hasModal === false) break;
    }

    const [answer, guesses] = await findAnswer(
        async (guess, guesses) => {
            console.log('making a guess of', guess);
            for (let i = 0; i < guess.length; i++) {
                const char = guess[i];
                await page.click(`button[data-key="${char}"]`);
            }
            await page.click('button[data-key="↵"]');

            // give the not a word toast a chance to show up
            await sleep(100);

            const wordNotFound = !!(await page.$('[class="Toast-module_toast__Woeb-"]'));
            if (wordNotFound) {
                // remove entries
                await page.click('button[data-key="←"]');
                await page.click('button[data-key="←"]');
                await page.click('button[data-key="←"]');
                await page.click('button[data-key="←"]');
                await page.click('button[data-key="←"]');
                await sleep(3000); // wait for toast to dismiss
                return null;
            }

            // word was scored, check out the results
            const tiles = await page.$$('[data-testid="tile"]');
            const rowTileStart = guesses * 5;
            const rowTiles = tiles.slice(rowTileStart, rowTileStart + 5);

            // wait for animation
            await sleep(2500);

            // absent
            // present
            const tileScorePromises = rowTiles.map(async rowTile => {
                const state = await page.evaluate(
                    tile => tile.getAttribute('data-state'),
                    rowTile
                );
                if (state === 'absent') {
                    return 0;
                } else if (state === 'present') {
                    return 1;
                } else if (state === 'correct') {
                    return 2;
                }
            });

            return await Promise.all(tileScorePromises);
        }
    );

    console.log(`\nFound ${answer} in ${guesses} tries 🤗`);

    console.log('\nstopping recording and puppeteer session before exiting...');

    await recorder.stop();
    await browser.close();
})();

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
