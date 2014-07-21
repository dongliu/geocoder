/**
 * @fileOverview read a csv file with addresses and output into a csv file with address, status, formatted address, rooftop geocodes.
 * @author Dong Liu
 */

/**
 * see https://developers.google.com/maps/articles/geocodestrat#quota-limits for the details of quota limits
 * And also here for the suggested approach
 * https://developers.google.com/maps/documentation/business/articles/usage_limits#limitexceeded
 */

var csv = require('csv'),
  fs = require('fs'),
  path = require('path'),
  geo = require('./lib/geo'),
  RateLimiter = require('limiter').RateLimiter,
  limiter = new RateLimiter(4, 'second'), // 4 requests per second limit
  inputPath,
  realPath,
  targetPath,
  addresses = [],
  index = -1;

/**
 * go through the {addresses} array for at most {times} to get geocode for unchecked or OVER_QUERY_LIMIT elements
 * @param  {Array}   addresses
 * @param  {Number}   round
 * @param  {Number}   times
 * @param  {Function} cb
 */
function gothrough(addresses, round, times, cb) {
  var finished = 0,
    retry = false;
  console.log('round: ' + round);
  addresses.forEach(function (element) {
    if (element[1] === 'NOT_CHECKED' || element[1] === 'OVER_QUERY_LIMIT') {
      limiter.removeTokens(1, function (err) {
        if (err) {
          console.log(err.message);
          process.exit(1);
        }
        geo.rooftopCode(element[0], function (err, data) {
          if (err) {
            element[1] = err.message;
            if (element[1] === 'OVER_QUERY_LIMIT' && !retry) {
              retry = true;
            }
          } else {
            if (data !== null) {
              element[1] = 'ROOFTOP';
              element[2] = data.formatted_address;
              element[3] = '(' + data.location.lat + ',' + data.location.lng + ')';
            } else {
              element[1] = 'NOT_ROOFTOP';
            }
          }
          finished += 1;
          if (finished === addresses.length) {
            round += 1;
            if (round < times && retry) {
              setTimeout(function () {
                gothrough(addresses, round, times, cb);
              }, 2000);
            } else {
              if (retry) {
                cb(new Error('OVER_QUERY_LIMIT'), addresses, round);
              } else {
                cb(null, addresses, round);
              }
            }
          }
        });
      });
    } else {
      finished += 1;
      if (finished === addresses.length) {
        round += 1;
        if (round < times && retry) {
          // hold on for 2 seconds
          setTimeout(function () {
            gothrough(addresses, round, times, cb);
          }, 2000);
        } else {
          if (retry) {
            cb(new Error('OVER_QUERY_LIMIT'), addresses, round);
          } else {
            cb(null, addresses, round);
          }
        }
      }
    }

  });
}

if (process.argv.length === 2) {
  inputPath = './example/test.csv';
}

if (process.argv.length > 2) {
  inputPath = process.argv[2];
}

realPath = path.resolve(__dirname, inputPath);

if (!fs.existsSync(realPath)) {
  console.warn(realPath + ' does not exist');
  console.warn('Plese input a valid csv file path.');
  process.exit(1);
}

targetPath = path.join(path.dirname(realPath), Date.now() + '.csv');

console.log('read the addresses from ' + realPath);

// read the addresses into an array

var parser = csv.parse();

parser.on('readable', function () {
  var record;
  while (record = parser.read()) {
    addresses.push([record[0], 'NOT_CHECKED', '', '']);
  }
});

parser.on('error', function (err) {
  console.log(err.message);
});

parser.on('finish', function () {
  addresses.shift();
  // go through the csv file for at most 5 times  
  gothrough(addresses, 0, 5, function (err, addresses, round) {
    if (err) {
      console.log(err.message + ' after ' + round + ' rounds.');
      console.log(addresses);
      process.exit(1);
    }
    console.log('task finished in ' + round + ' rounds.');
    console.log('write corresponding rooftop geocodes to ' + targetPath);
    csv.stringify(addresses, function (err, output) {
      if (err) {
        console.log(err.message);
        process.exit(1);
      }
      fs.writeFile(targetPath, output, function (err) {
        if (err) {
          console.log(err.message);
          process.exit(1);
        }
        console.log('write finished');
      });
    });
  });
});
fs.createReadStream(realPath).pipe(parser);