var jsonfile = require('jsonfile');
var file = 'urls.json';
var URLS = jsonfile.readFileSync(file);

var phantomjs = require('phantomjs-prebuilt');
var program = phantomjs.exec('screener.js', URLS);
program.stdout.pipe(process.stdout);
program.stderr.pipe(process.stderr);
program.on('exit', code => {
  // do something on end
  console.log('EXIT');
});
