/**
 * @fileOverview read a csv file with addresses and output a csv file with corresponding rooftop geocodes if found.
 * @author Dong Liu
 */

var csv = require('csv'),
  fs = require('fs'),
  path = require('path'),
  geo = require('./lib/geo'),
  RateLimiter = require('limiter').RateLimiter,
  limiter = new RateLimiter(1, 'second'),
  inputPath,
  realPath,
  targetPath,
  index = -1;

if (process.argv.length === 2) {
  inputPath = './example/test.csv';
}

if (process.argv.length > 2) {
  inputPath = process.argv[2];
}

realPath = path.resolve(__dirname, inputPath);

if (!fs.existsSync(realPath)) {
  console.warn(realPath + ' does not exist');
  process.exit(1);
}

targetPath = path.join(path.dirname(realPath), Date.now() + '.csv');

console.log('read the addresses from ' + realPath + ', and output corresponding rooftop geocodes to ' + targetPath);

fs.createReadStream(realPath)
  .pipe(csv.parse())
  .pipe(csv.transform(function (record, cb) {
    setImmediate(function () {
      index += 1;
      if (index === 0) {
        record.push('formatted', 'geocode');
        cb(null, record);
      } else {
        limiter.removeTokens(1, function () {
          geo.rooftopCode(record[0], function (err, data) {
            if (data !== null) {
              record.push(data.formatted_address, '(' + data.location.lat + ',' + data.location.lng + ')');
            } else {
              record.push('', '');
            }
            cb(null, record);
          });
        });
      }
    });
  }))
  .pipe(csv.stringify())
  .pipe(fs.createWriteStream(targetPath));