/*global describe, it, before, beforeEach, after, afterEach */

var assert = require('assert'),
  should = require('should'),
  geo = require('../lib/geo');

describe('geo', function () {
  this.timeout(0);

  describe('#isRooftop()', function () {
    it('should return true when the input is rooftop', function () {
      geo.isRooftop({
        "results": [{
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
        }],
        "status": "OK"
      }).should.be.true;
    });

    it('should return false when the input is not rooftop', function () {
      geo.isRooftop({
        "status": "OK",
        "results": [{
          "types": ["sublocality", "political"],
          "formatted_address": "Winnetka, California, USA",
          "address_components": [{
            "long_name": "Winnetka",
            "short_name": "Winnetka",
            "types": ["sublocality", "political"]
          }, {
            "long_name": "Los Angeles",
            "short_name": "Los Angeles",
            "types": ["administrative_area_level_3", "political"]
          }, {
            "long_name": "Los Angeles",
            "short_name": "Los Angeles",
            "types": ["administrative_area_level_2", "political"]
          }, {
            "long_name": "California",
            "short_name": "CA",
            "types": ["administrative_area_level_1", "political"]
          }, {
            "long_name": "United States",
            "short_name": "US",
            "types": ["country", "political"]
          }],
          "geometry": {
            "location": {
              "lat": 34.2131710,
              "lng": -118.5710220
            },
            "location_type": "APPROXIMATE",
            "viewport": {
              "southwest": {
                "lat": 34.1947148,
                "lng": -118.6030368
              },
              "northeast": {
                "lat": 34.2316232,
                "lng": -118.5390072
              }
            },
            "bounds": {
              "southwest": {
                "lat": 34.1791050,
                "lng": -118.5883200
              },
              "northeast": {
                "lat": 34.2353090,
                "lng": -118.5534191
              }
            }
          }
        }]
      }).should.be.false;
    });
  });

  describe('#rooftopCode()', function () {
    it('should return a rooftop geocode', function (done) {
      geo.rooftopCode('3895 Church Street, Clarkston, GA 30021, USA', function (err, data) {
        (err === null).should.be.true;
        data.location.should.not.be.String;
        done();
      });
    });

    it('should return a rooftop geocode', function (done) {
      geo.rooftopCode('75 East Indiantown Road, Concourse Village Shopping Center, Jupiter, FL', function (err, data) {
        (err === null).should.be.true;
        data.location.should.not.be.String;
        console.log(data);
        done();
      });
    });


    it('should return a non-rooftop geocode', function (done) {
      geo.rooftopCode('7665 Honey Abbey, Koggiung, MA', function (err, data) {
        (err === null).should.be.true;
        (data === null).should.be.true;
        done();
      });
    });
  });

});