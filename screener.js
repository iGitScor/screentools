var system = require('system');
var scriptParameters = require('minimist')(process.argv.slice(2));
var args = system.args;
const URLS = args[1].split(',');

if (!scriptParameters.hasOwnProperty('site')) {
  console.error('You must provide site');
  process.exit(1);
}

const SCREENSHOT_WIDTH = scriptParameters.width || 1024;
const SCREENSHOT_HEIGHT = scriptParameters.height || 768;
const LOAD_WAIT_TIME = 10000;

var getPageHeight = function (page) {
  var documentHeight = page.evaluate(function () {
    return document.body.offsetHeight;
  });

  return documentHeight;
};

var renderPage = function (page) {
  var pageName = scriptParameters.site.split(page.url)[1];
  var pageHeight = getPageHeight(page);

  page.clipRect = {
    top: 0,
    left: 0,
    width: SCREENSHOT_WIDTH,
    height: pageHeight,
  };

  page.render('screenshots/' + pageName + 'screen.png');
  console.log('rendered: screenshots/' + pageName + 'screen.png for url ' + page.url);
};

var exitIfLast = function (index, array) {
  console.log(array.length - index - 1, 'more screenshots to go!');
  console.log('~~~~~~~~~~~~~~');
  if (index == array.length - 1) {
    console.log('exiting phantomjs');
    phantom.exit();
  }
};

var takeScreenshot = function (element) {
  console.log('opening URL:', element);

  var page = require('webpage').create();

  page.viewportSize = {
    width: SCREENSHOT_WIDTH,
    height: SCREENSHOT_HEIGHT,
  };

  page.open(element);

  console.log('waiting for page to load...');

  page.onLoadFinished = function () {
    setTimeout(function () {
      console.log("that's long enough");
      renderPage(page);
      exitIfLast(index, URLS);
      index++;
      takeScreenshot(URLS[index]);
    }, LOAD_WAIT_TIME);
  };
};

var index = 0;

takeScreenshot(URLS[index]);
