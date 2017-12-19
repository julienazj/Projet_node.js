var reporter = require('nodeunit').reporters.nested;

process.chdir("unit");
reporter.run(['tests.js']);