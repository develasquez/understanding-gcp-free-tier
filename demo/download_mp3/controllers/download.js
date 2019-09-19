const puppeteer = require('puppeteer');

exports.getUrl = getUrlAsync;
let browser, page;


async function getUrlAsync(url) {
  var downloadUrl = "";

  try {
    if(!browser){
      browser = await puppeteer.launch({
        //headless: false
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--deterministic-fetch']
      });
    }
    page = await browser.newPage();
    page.on('response', response => {
      response.text().then(function (textBody) {
          console.log(textBody);
      })
  })
    await page.goto('https://ytmp3.cc/')
    console.log("Load");
    await page.screenshot({path: 'buddy-screenshot'+ new Date().getTime() +'.png'});
    let input = await page.$("#input");
    await input.click({
      delay: 1
    })
    await page.screenshot({path: 'buddy-screenshot'+ new Date().getTime() +'.png'});
    console.log("Click input");
    await input.type(url, {
      delay: 1
    })
    await page.screenshot({path: 'buddy-screenshot'+ new Date().getTime() +'.png'});
    console.log("Url", url);
    await page.click("#submit", {
      delay: 1000
    })
    await page.screenshot({path: 'buddy-screenshot'+ new Date().getTime() +'.png'});
    console.log("Submit");
    
    
    await page.waitForSelector("#progress[style='display: none;']")
    console.log("hide Progress");
    await page.screenshot({path: 'buddy-screenshot'+ new Date().getTime() +'.png'});
    return await getUrl(page);
    
    //await browser.close();
  } catch (ex) {
    console.log(ex);
    downloadUrl = ex;
    await page.close();
    //await browser.close();
    return downloadUrl;
  }
  
};

const getUrl = (page) => new Promise((resolve, reject) => {
  console.log("Entro")
  const interval = setInterval(async () => {
    console.log("Interval")
    const title = await page.$("#title");
    const name = await page.evaluate(title => title.textContent, title);
    
    console.log(name)
    var downloadUrl = await page.$eval("#buttons > a:nth-child(1)", el => el.href);
      console.log(downloadUrl);
      await page.screenshot({path: 'buddy-screenshot'+ new Date().getTime() +'.png'});
    if(name != "Please insert a valid video URL" &&  name != "title"){
      console.log(name);
      clearInterval(interval);
      console.log("Find Download");
      var downloadUrl = await page.$eval("#buttons > a:nth-child(1)", el => el.href);
      console.log(downloadUrl);
      await page.close();
      resolve(downloadUrl);
    }
  },1000);
})

async function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

async function asyncFor(total, callback) {
  for (let index = 0; index < total; index++) {
    await callback(index)
  }
}