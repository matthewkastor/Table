# Table

Generate HTML tables from two dimensional JavaScript arrays.

## Installation

```
npm install git+https://github.com/matthewkastor/Table.git#master
```

Source code available at: https://github.com/matthewkastor/Table/

## Usage

In node:

```
var Table = require('Table');
console.log(new Table());
```

In the browser, include `./browser/Table_web.js` in your page. `Table` will
 be available in your page.

For full documentation see the docs folder.

## Tests

Tests can be run from the root of this package with

```
npm test
```

Tests can be run in the browser by navigating to `browser/Table_tests.html`

## Hacking

There are several other scripts listed in package.json for development and
 hacking on this module. They can be run with `npm run-script` followed by the
 scripts property corresponding to the script you want to run. For example,
 given a script called `buildDocs`, it could be run from the package root by:

```
npm run-script buildDocs
```

## Author

Matthew Kastor

atropa

matthewkastor@gmail.com

https://plus.google.com/100898583798552211130

## License

gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html