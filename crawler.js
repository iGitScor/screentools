var Crawler = require('js-crawler');
var jsonfile = require('jsonfile');
var scriptParameters = require('minimist')(process.argv.slice(2));

if (!scriptParameters.hasOwnProperty('site')) {
  console.error('You must provide site');
  process.exit(1);
}

new Crawler().configure({ depth: 2 })
  .crawl(
    scriptParameters.site,
    () => null,
    () => null,
    function onFinished(urls) {
      var file = 'urls.json';
      urls.shift();
      urls.pop();
      jsonfile.writeFileSync(file, urls);

      console.log('OK.');
    }
  );
