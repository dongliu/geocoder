var geocoder = require('geocoder');

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
  geocoder.geocode(address, function (err, data) {
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
      return cb(null, {
        formatted_address: data.results[0].formatted_address,
        location: 'no rooftop code'
      });
    }
  });
}

module.exports = {
  isRooftop: isRooftop,
  rooftopCode: rooftopCode
};