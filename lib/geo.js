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
    }
  }, function (err, resp, body) {
    if (err) {
      return cb(err);
    }
    cb(null, JSON.parse(body));
  });
}

/**
 * check if the json geo representation is of "rooftop" quality
 * The implementation is the simplest for google geocoding API.
 * @param  {Object}  json
 * @return {Boolean}
 */
function isRooftop(json) {
  // TODO: need more work like a retry to handle other statuses like "OVER_QUERY_LIMIT", "REQUEST_DENIED", and "UNKNOWN_ERROR"
  if (json.status !== 'OK') {
    return false;
  }
  if (json.results) {
    if (json.results.length !== 1) {
      return false;
    }
  }
  if (json.results[0].geometry.location_type === 'ROOFTOP') {
    return true;
  }
  return false;
}

/**
 * get only the rooftop geocode of a given address
 * @param  {[type]}   address
 * @param  {Function} cb
 */
function rooftopCode(address, cb) {
  geocode(address, function (err, data) {
    if (err) {
      return cb(err, null);
    }
    if (data) {
      if (isRooftop(data)) {
        return cb(null, {
          formatted_address: data.results[0].formatted_address,
          location: data.results[0].geometry.location
        });
      }
      return cb(null, null);
    } else {
      return cb(new Error('no data'), null);
    }
  });
}

module.exports = {
  geocode: geocode,
  isRooftop: isRooftop,
  rooftopCode: rooftopCode
};