var assert = require('assert');
var needle = require('needle');
var semver = require('semver');

function cleanVersion(badVersion) {
  var parts = badVersion.split('.');
  var clean = parts.slice(0,3).join('.');
  if (parts.length > 3) {
    for (var i = 3; i < parts.length; i++) {
      clean += "-" + parts[i];
    };
  }
  return clean;
}

var headers = {
  DataServiceVersion: '1.0;NetFx',
  MaxDataServiceVersion: '2.0;NetFx',
  Accept: 'application/json',
  'User-Agent': 'Mozu Metadata Reaper'
};

module.exports = function getNugetPackage(config) {
  assert(config.host && config.package, "Please supply a Nuget HTTP host and a package name.");
  return new Promise(function(resolve, reject) {
    needle.request('get', config.host + "/api/v2/package-versions/" + config.package, 
    {
      includePrerelease: true
    },
    {
      headers: headers
    }, function(err, res) {
      var releases = res.body;
      if (err) return reject(err);
      console.log(releases.length + ' releases found: \n  ' + releases.join('\n  '));
      var qualifyingRelease = semver.maxSatisfying(releases, config.version, true);
      if (!qualifyingRelease) {
        return reject(new Error("No qualifying release found for " + config.version + " in " + releases));
      }
      console.log('Release ' + qualifyingRelease + " satisfies " + config.version + ". Downloading...")
      return resolve({ version: qualifyingRelease, contentStream: needle.get(config.host + '/api/packages/' + config.package + '/' + qualifyingRelease + '/content')});
    });
  });
}