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
    console.log("goto");


    await page.goto('https://y2mate.com/es/youtube-to-mp3');
    console.log("input");
    let input = await page.$("#txt-url");
    await input.click({
      delay: 1
    });
    await input.type(url, {
      delay: 1
    });
    console.log(url);
    await page.click("#btn-submit", {
      delay: 1000
    });
    console.log("click");
    await page.waitForSelector(".caption");
    const result = await page.evaluate(x => {
      return changeMp3Type(96,"MP3 96 kbps");
    }, 0);
    await page.waitForSelector("#process_mp3");
    console.log("wait proccess");
    await page.click("#process_mp3");
    await page.waitForSelector(".has-success");
    var downloadUrl = await page.$eval('.has-feedback .btn-success', el => el.href);
    console.log(downloadUrl);
    await page.close();
    await browser.close();
  } catch (ex) {
    downloadUrl = ex;
    await page.close();
    await browser.close();
  }
  return downloadUrl;
};