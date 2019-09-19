const puppeteer = require('puppeteer');

exports.getUrl = getUrlAsync;


async function getUrlAsync(url) {
  var downloadUrl = "";
  let browser, page;
  try {
    browser = await puppeteer.launch({
      //headless: false
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--deterministic-fetch']
    });

    page = await browser.newPage();
    page.setCacheEnabled(true);
    await page.goto('https://ytmp3.cc/');
    await page.screenshot({path: 'buddy-screenshot'+ new Date().getTime() +'.png'});
    console.log("Load");
    let input = await page.$("#input");
    await input.click({
      delay: 1
    });
    await page.screenshot({path: 'buddy-screenshot'+ new Date().getTime() +'.png'});
    console.log("Click input");
    await input.type(url, {
      delay: 1
    });
    await page.screenshot({path: 'buddy-screenshot'+ new Date().getTime() +'.png'});
    console.log("Url", url);
    await page.click("#submit", {
      delay: 1000
    });
    await page.screenshot({path: 'buddy-screenshot'+ new Date().getTime() +'.png'});
    console.log("Submit");
    wait(10000);
    await page.waitForSelector("#progress[style='display: none;']");
    await page.screenshot({path: 'buddy-screenshot'+ new Date().getTime() +'.png'});
    console.log("hide Progress");
    await page.waitForSelector("#buttons[style='display: block;']");
    await page.screenshot({path: 'buddy-screenshot'+ new Date().getTime() +'.png'});
    console.log("Find Download");
    var downloadUrl = await page.$eval("#buttons > a:nth-child(1)", el => el.href);
    await page.screenshot({path: 'buddy-screenshot'+ new Date().getTime() +'.png'});
    console.log(downloadUrl);
    await page.close();
    //await browser.close();
  } catch (ex) {
    console.log(ex);
    downloadUrl = ex;
    await page.close();
    //await browser.close();
  }
  return downloadUrl;
};
async function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}