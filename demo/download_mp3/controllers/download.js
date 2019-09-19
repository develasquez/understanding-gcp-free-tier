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
    let input = await page.$("#input");
    await input.click({
      delay: 1
    });
    await input.type(url, {
      delay: 1
    });
    await page.click("#submit", {
      delay: 1000
    });
    //wait(3000);
    await page.waitForSelector("#progress[style='display: none;']");
    await page.waitForSelector("#buttons[style='display: block;']");
    var downloadUrl = await page.$eval("#buttons > a:nth-child(1)", el => el.href);
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