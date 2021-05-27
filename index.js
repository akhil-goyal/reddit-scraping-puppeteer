const puppeteer = require('puppeteer');

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

    let expandButtons = await page.$$('.morecomments');

    while (expandButtons.length) {

        for (let button of expandButtons) {
            await button.click();
            await page.waitForTimeout(500);
        }

        await page.waitForTimeout(1000);

        expandButtons = await page.$$('.morecomments');

    }

    await browser.close();

})();