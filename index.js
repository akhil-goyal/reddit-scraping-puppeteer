const puppeteer = require('puppeteer');
const Sheet = require('./sheet');

const URL = `https://old.reddit.com/r/learnprogramming/comments/4q6tae/i_highly_recommend_harvard_free_online_2016_cs50/`;

(async () => {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setViewport({
        width: 1280,
        height: 960,
        deviceScaleFactor: 1,
    });

    await page.goto(URL);

    const sheet = new Sheet();

    await sheet.load();

    const title = await page.$eval('.title a', el => el.textContent);

    const sheetIndex = await sheet.addSheet(title.slice(0, 99), ['points', 'text']);

    let expandButtons = await page.$$('.morecomments');

    while (expandButtons.length) {

        for (let button of expandButtons) {
            await button.click();
            await page.waitForTimeout(500);
        }

        await page.waitForTimeout(1000);

        expandButtons = await page.$$('.morecomments');

    }

    const comments = await page.$$('.entry');

    const formattedComments = [];

    for (let comment of comments) {

        const points = await comment.$eval('.score', el => el.textContent).catch(err => console.error('No score'));

        const rawText = await comment.$eval('.usertext-body', el => el.textContent).catch(err => console.error('No Text'));

        if (points && rawText) {

            const text = rawText.replace(/\n/g, '');

            formattedComments.push({ points, text });
        }
    }

    formattedComments.sort((a, b) => {
        const pointsA = Number(a.points.split(' ')[0]);
        const pointsB = Number(b.points.split(' ')[0]);

        return pointsA - pointsB;
    })

    sheet.addRows(formattedComments, sheetIndex);

    await browser.close();

})();