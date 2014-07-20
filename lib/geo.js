/**
 * @fileOverview functions to get rooftop geocode of an address.
 * @author Dong Liu
 */

var request = require('request');

/**
 * get geocode from google via an HTTP request
 * @param  {String}   address
 * @param  {Function} cb
 */
function geocode(address, cb) {
  if (!address) {
    return cb(new Error('no given address'));
  }
  request({
    uri: "http://maps.googleapis.com/maps/api/geocode/json",
    qs: {
      address: address
    },
    'pool.maxSockets': 1
  }, function (err, resp, body) {
    if (err) {
      return cb(err);
    }
    cb(null, JSON.parse(body));
  });
}

/**
 * get only the rooftop geocode of a given address
 * @param  {String}   address
 * @param  {Function} cb
 */
function rooftopCode(address, cb) {
  geocode(address, function (err, data) {
    if (err) {
      return cb(err);
    }
    if (data) {
      if (data.status !== 'OK') {
        return cb(new Error(data.status));
      }
      if (data.results) {
        if (data.results.length !== 1) {
          return cb(null, null);
        }
        if (data.results[0].geometry.location_type === 'ROOFTOP') {
          return cb(null, {
            formatted_address: data.results[0].formatted_address,
            location: data.results[0].geometry.location
          });
        }
        return cb(null, null);
      }
    }
    return cb(new Error('no data'), null);
  });
}



module.exports = {
  geocode: geocode,
  rooftopCode: rooftopCode
};