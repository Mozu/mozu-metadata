var getNugetPackage = require('./get-nuget-package');
var unzip = require('unzip');
var exec = require('child_process').exec;
var fs = require('fs');

var actionDefPath = './data/action-definitions.json';
var packageActionDefPath = 'tools/ActionDefinitions.json';

getNugetPackage({
  host: process.env.npm_package_config_nugetHost,
  version: process.env.npm_package_config_nugetVersion,
  'package': process.env.npm_package_config_nugetPackage
}).then(function(result) {
  result.contentStream.pipe(unzip.Parse())
    .on('entry', function(entry) {
      if (entry.path === packageActionDefPath) {
        console.log('Extracting action definitions...')
        entry.pipe(fs.createWriteStream(actionDefPath)).on('end', function() {
          console.log('Action definitions extracted to ' + actionDefPath);
          exec('git add ' + actionDefPath + ' && git commit -m Updating action definitions for Mozu API version ' + result.version + ' && npm version ' + result.version, {
            cwd: '../'
          }, function(err, stdout, stderr) {
            if (err) {
              return console.error('Update failed! ' + err.message);
            }
            console.log(stdout);
            console.log(stderr);
            console.log('\nUpdate complete!');
          })
        })
      } else {
        entry.autodrain();
      }
    })
})