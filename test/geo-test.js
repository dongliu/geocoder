/*global describe, it, before, beforeEach, after, afterEach */
var assert = require('assert'),
  should = require('should'),
  geo = require('../lib/geo');
describe('geo', function () {
  describe('#decoder()', function () {
    it('should return "ok" when the input is given', function (done) {
      geo.decoder('some address', function (err, res) {
        if (err) {
          return done(err);
        }
        res.should.be.exactly('ok');
        done();
      });
    });

    it('should return an Error when the input is not given', function (done) {
      geo.decoder(null, function (err, res) {
        err.should.be.an.Error;
        done();
      });
    });
  });

  describe('#isRooftop()', function () {
    it('should return true when the input is rooftop', function () {
      geo.isRooftop({
        "address_components": [{
          "long_name": "1600",
          "short_name": "1600",
          "types": ["street_number"]
        }, {
          "long_name": "Amphitheatre Pkwy",
          "short_name": "Amphitheatre Pkwy",
          "types": ["route"]
        }, {
          "long_name": "Mountain View",
          "short_name": "Mountain View",
          "types": ["locality", "political"]
        }, {
          "long_name": "Santa Clara",
          "short_name": "Santa Clara",
          "types": ["administrative_area_level_2", "political"]
        }, {
          "long_name": "California",
          "short_name": "CA",
          "types": ["administrative_area_level_1", "political"]
        }, {
          "long_name": "United States",
          "short_name": "US",
          "types": ["country", "political"]
        }, {
          "long_name": "94043",
          "short_name": "94043",
          "types": ["postal_code"]
        }],
        "formatted_address": "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
        "geometry": {
          "location": {
            "lat": 37.42291810,
            "lng": -122.08542120
          },
          "location_type": "ROOFTOP",
          "viewport": {
            "northeast": {
              "lat": 37.42426708029149,
              "lng": -122.0840722197085
            },
            "southwest": {
              "lat": 37.42156911970850,
              "lng": -122.0867701802915
            }
          }
        },
        "types": ["street_address"]
      }).should.be.ok;
    });

    it('should return false when the input is not rooftop', function () {
      geo.isRooftop({
        "address_components": [{
          "long_name": "1600",
          "short_name": "1600",
          "types": ["street_number"]
        }, {
          "long_name": "Amphitheatre Pkwy",
          "short_name": "Amphitheatre Pkwy",
          "types": ["route"]
        }, {
          "long_name": "Mountain View",
          "short_name": "Mountain View",
          "types": ["locality", "political"]
        }, {
          "long_name": "Santa Clara",
          "short_name": "Santa Clara",
          "types": ["administrative_area_level_2", "political"]
        }, {
          "long_name": "California",
          "short_name": "CA",
          "types": ["administrative_area_level_1", "political"]
        }, {
          "long_name": "United States",
          "short_name": "US",
          "types": ["country", "political"]
        }, {
          "long_name": "94043",
          "short_name": "94043",
          "types": ["postal_code"]
        }],
        "formatted_address": "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
        "geometry": {
          "location": {
            "lat": 37.42291810,
            "lng": -122.08542120
          },
          "location_type": "RANGE_INTERPOLATED",
          "viewport": {
            "northeast": {
              "lat": 37.42426708029149,
              "lng": -122.0840722197085
            },
            "southwest": {
              "lat": 37.42156911970850,
              "lng": -122.0867701802915
            }
          }
        },
        "types": ["street_address"]
      }).should.not.be.ok;
    });
  });
});