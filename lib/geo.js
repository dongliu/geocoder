function decoder (address, cb) {
  if (address) {
    return cb(null, 'ok');
  }
  return cb(new Error('no address given'));
}

function isRooftop (json) {
  if (json.geometry.location_type === 'ROOFTOP') {
    return true;
  }
  return false;
}

module.exports = {
  decoder: decoder,
  isRooftop: isRooftop
};