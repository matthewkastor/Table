var Table = require('../src/Table.js');
var fs = require('fs');
var path = require('path');
var specPath = path.resolve(__dirname, '../browser/tests/Table.test.js');
var specCode = fs.readFileSync(specPath, "utf8");
eval(specCode);
