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
        reject(new Error(stderr));
      } else {
        resolve(stdout && stdout.trim() || '');
      }
    });
  });
}

exec("git ls-files -m")
  .then(function(out) {
    if (out.indexOf('package.json') !== -1) {
      throw new Error("Cannot update contracts unless package.json is unmodified. Please commit or discard changes.");
    }
  }).then(function() {
    var conf = {
      host: process.env.npm_package_config_nugetHost,
      version: process.env.npm_package_config_nugetVersion,
      'package': process.env.npm_package_config_nugetPackage
    };
    console.log('Getting NuGet package ' + conf.package + ' versions satisfying ' + conf.version + ' from ' + conf.host);
    return getNugetPackage(conf);
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
                  throw new Error("No change to action definitions was found. No update necessary!");
                } else {
                  return exec('git add ' + actionDefPath)
                }
              }).then(function() {
                console.log('Committing new action definitions to Git...')
                return exec('git commit -m "Updating action definitions for Mozu API version ' + result.version + '"');
              }).then(function() {
                console.log('Updating package version...');
                var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
                pkg.version = result.version;
                fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2), 'utf8');
                return exec('git commit -am "Updating package.json to ' + pkg.version + '"');
              }).then(function() {
                console.log('Adding Git tag for v' + result.version);
                return exec('git tag -a v' + result.version + ' -m "updating contracts"');
              }).then(function() {
                console.log('\nUpdate complete! Run `npm publish` now to publish to the npm registry.')
              }).catch(console.error);

          })
        } else {
          entry.autodrain();
        }
      });
  }).catch(console.error);