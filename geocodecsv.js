var csv = require('csv'),
  fs = require('fs'),
  path = require('path'),
  inputPath, realPath;

if (process.argv.length === 2) {
  inputPath = './example/test.csv';
}

if (process.argv.length > 2) {
  inputPath = process.argv[2];
} 

filePath = path.resolve(__dirname, inputPath);

if (!fs.existsSync(filePath)) {
  return console.warn(filePath + ' does not exist');
}

console.log('get rooftop geocodes of the addresses in ' + filePath);