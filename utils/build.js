var getNugetPackage = require('./get-nuget-package');
var unzip = require('unzip');
var childProcess = require('child_process');
var fs = require('fs');

var actionDefPath = './data/action-definitions.json';
var packageActionDefPath = 'tools/ActionDefinitions.json';

function exec(cmd) {
  return new Promise(function(resolve, reject) {
    childProcess.exec(cmd, {
      cwd: './'
    }, function(err, stdout, stderr) {
      console.log(stderr);
      if (err) {
        reject(err);
      } else {
        resolve(stdout && stdout.trim() || '');
      }
    });
  });
}

exec("git ls-files -m")
  .then(function(out) {
    if (out.indexOf('package.json') !== -1) {
      throw new Error("Cannot update contracts unless package.json is clean.");
    }
  }).then(function() {
    return getNugetPackage({
      host: process.env.npm_package_config_nugetHost,
      version: process.env.npm_package_config_nugetVersion,
      'package': process.env.npm_package_config_nugetPackage
    });
  }).then(function(result) {
    result.contentStream.pipe(unzip.Parse())
      .on('entry', function(entry) {
        if (entry.path === packageActionDefPath) {
          console.log('Extracting action definitions...')
          entry.pipe(fs.createWriteStream(actionDefPath)).on('close', function() {
            console.log('Action definitions extracted to ' + actionDefPath);

            exec('git ls-files -m')
              .then(function(out) {
                if (out.indexOf('action-definitions.json') === -1) {
                  throw new Error("No change to action definitions!");
                } else {
                  return exec('git add ' + actionDefPath)
                }
              }).then(function() {
                return exec('git commit -m "Updating action definitions for Mozu API version ' + result.version + '"');
              }).then(function() {
                var pkg = require('./package.json');
                pkg.version = result.version.
                fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2), 'utf-8');
                return exec('git tag -a v' + result.version + ' -m "updating contracts"');
              }).then(function(out) {
                console.log(out);
                console.log('\nUpdate complete! Run `npm publish` now to publish to the npm registry.')
              }).catch(console.error);

          })
        } else {
          entry.autodrain();
        }
      });
  });