var path = require('path');
var babel = require("babel-core");
var fs = require('fs');
var shell = require('shelljs');

var rootDir = path.join(__dirname, '../');

function resolvePath(p) {
    return path.join(rootDir, p);
}

shell.cd(rootDir);
if (!shell.test('-e', './dist')) {
    shell.mkdir('-p', './dist');
}

fs.writeFileSync(resolvePath('dist/index.js'), babel.transformFileSync(resolvePath('src/index.js')).code);


shell.cp('./src/run_in_phantom.js', './dist/run_in_phantom.js');

console.log('build finish');

if (!shell.test('-e', './dist/phantomjs')) {
    console.log(' - Warn: no phantomjs in dist directory. For more information, see [Deploy] section in README.md');
}