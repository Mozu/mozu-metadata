var getNugetPackage = require('./utils/get-nuget-package');
var pkg = require('./package.json');
var unzip = require('unzip');
var fs = require('fs');

getNugetPackage(pkg.nuget).then(function(stream) {
  stream.pipe(unzip.Parse())
    .on('entry', function(entry) {
      if (entry.path === "tools/ActionDefinitions.json") {
        console.log('Extracting action definitions...')
        entry.pipe(fs.createWriteStream('./data/action-definitions.json'));
      } else {
        entry.autodrain();
      }
    })
})