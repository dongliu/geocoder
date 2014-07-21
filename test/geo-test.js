/*global describe, it, before, beforeEach, after, afterEach */
/*jshint expr: true*/

var assert = require('assert'),
  should = require('should'),
  geo = require('../lib/geo');

describe('geo', function () {
  this.timeout(3000);
  describe('#rooftopCode()', function () {
    it('should return a rooftop geocode', function (done) {
      geo.rooftopCode('3895 Church Street, Clarkston, GA 30021, USA', function (err, data) {
        if (err === null) {
          console.log(data);
          data.location.lat.should.be.Number;
          data.formatted_address.should.be.String;
        } else {
          console.log(err);
        }
        done();
      });
    });

    it('should return a rooftop geocode', function (done) {
      geo.rooftopCode('75 East Indiantown Road, Concourse Village Shopping Center, Jupiter, FL', function (err, data) {
        if (err === null) {
          console.log(data);
          data.location.lat.should.be.Number;
          data.formatted_address.should.be.String;
        } else {
          console.log(err);
        }
        done();
      });
    });


    it('should not return a rooftop geocode', function (done) {
      geo.rooftopCode('7665 Honey Abbey, Koggiung, MA', function (err, data) {
        if (err === null) {
          (data === null).should.be.true;
        } else {
          console.log(err);
        }
        done();
      });
    });
  });

});