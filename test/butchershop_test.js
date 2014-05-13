'use strict';

/*

Copyright (c) 2014 Shane Daniel, contributors

Portions taken from https://github.com/gruntjs/grunt-contrib-connect

Copyright (c) 2014 "Cowboy" Ben Alman, contributors

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var http = require('http');
var https = require('https');
var Q = require('q');
var _ = require('lodash');

function get(url, done) {
  var client = http;
  if ((typeof url === 'string' && url.toLowerCase().indexOf('https') === 0) ||
    (typeof url === 'object' && url.port === 443) ||
    (typeof url === 'object' && url.scheme === 'https')) {
    client = https;
    delete url.scheme;
  }
  client.get(url, function(res) {
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    }).on('end', function() {
      done(res, body);
    });
  });
}

function makeCallsThenAssert(choppedReq, actualReq, assertions) {
  var choppedDeferred = new Q.defer();
  var actualDeferred = new Q.defer();
  var allDone = Q.all([choppedDeferred.promise, actualDeferred.promise]);

  allDone.then(function(resolution){
    return new Q(_.flatten(resolution));
  }).spread(assertions);

  get(choppedReq, function(res, body) {
      choppedDeferred.resolve([res, body]);
    });

  get(actualReq, function(res, body) {
    actualDeferred.resolve([res, body]);
  });
}

exports.butchershop = {
  exampleCSS: function (test) {
    test.expect(3);

    function assertions(choppedRes, choppedBody, actualRes, actualBody) {
      test.equal(choppedRes.statusCode, 200, 'chopped server should return 200');
      test.equal(actualRes.statusCode, 200, 'actual server should return 200');
      test.notEqual(actualBody, choppedBody, 'chopped server css should be different');
      test.done();
    }

    var choppedReq = {
      scheme: 'http',
      hostname: 'localhost',
      port: 8000,
      path: '/stylus/index.css',
      headers: {
        accept: 'text/css',
      }
    };

    var actualReq ={
      scheme: 'https',
      hostname: 'www.npmjs.org',
      port: 443,
      path: '/stylus/index.css',
      headers: {
        accept: 'text/css'
      }
    };

    makeCallsThenAssert(choppedReq, actualReq, assertions);

  }
};
