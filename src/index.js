const chromium = require('chrome-aws-lambda');

const config = require('./config.js');

const processPageFn = require('./processPage.js');

function sleep(duration = 1) {
  return new Promise(function (resolve) {
    setTimeout(resolve, duration * 1000);
  });
};

async function startChrome() {
  const args = [
    '--disable-web-security',
    '--blink-settings=imagesEnabled=false',
    `--user-agent="${config.userAgent}"`,
    '--disable-gpu'
  ].concat(chromium.args);

  const path = await chromium.executablePath;
  console.log(path);
  const browser = await chromium.puppeteer.launch({
    args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true
  });
  return browser;
}


function renderPage(pageUrl) {
  return new Promise(async function (resolve, reject) {
    let browser = null;
    try {
      console.log('start render');
      browser = await startChrome();
      const page = await browser.newPage();
      await page.goto(pageUrl);
      console.log('chrome ready');
      await sleep(config.waitTime);
      await page.evaluate(processPageFn);
      const htmlHandle = await page.$('html');
      const result = await page.evaluate(html => html.outerHTML, htmlHandle);
      await htmlHandle.dispose();
      resolve(result);
      await browser.close();
    } catch (e) {
      console.log(e);
      reject(e);
      if (browser !== null) {
        await browser.close();
      }
    }
  });
}

exports.renderPage = renderPage;

// (async function runTest(pageUrl) {
//   const content = await renderPage(pageUrl);
//   console.log(content);
// })('https://www.kesci.com');
