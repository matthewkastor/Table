/*jslint
    white : true
*/
/*globals
    Table,
    console
*/

// uncomment the following to run in node, note that you can't generate
// html in node without a module to give you a DOM, like jsdom or something.
// you'll also have to uncomment the last line of this script.
//var Table = require('Table');

// this function is called when the button on the html page is pressed.
function run_example() {
    'use strict';
    var t, dummyDbResults;

    t = new Table();

    /**
     * after running something like
     * var dummyDbResults = JSON.parse(results);
     * the dummyDbResults variable will contain some data like what's below.
     */
    dummyDbResults = [{
            "column_a" : "a1",
            "column_b" : "b1"
        }, {
            "column_a" : "a2",
            "column_b" : "b2"
        }, {
            "column_a" : "a3",
            "column_b" : "b3"
        }
    ];

    /**
     * Object.keys returns an array of property names contained directly on the
     * object. In this case it will be ['column_a', 'column_b'] which, as luck would
     * have it, is exactly what the Table module needs to name the column headings.
     * dummyDbResults[0] accesses the first item stored in the array, which will be
     * an object representing a row from the database. Since all the rows will have
     * the same columns we just grab the property names of the first row.
     */
    t.headings = Object.keys(dummyDbResults[0]);

    /**
     * Given the results array, we'll go through each row and write the data to the
     * multidimensional array (table), since we've set up aliases for the column
     * names we simply increment the row number to create a new row in the table
     * and the data will be mapped into it's proper position. Better yet, instead
     * of creating a counter and incrementing it, we'll just reuse the index number
     * from the results array since we know the results array will not be sparse.
     */
    dummyDbResults.forEach(function (resultRow, idx) {
        Object.keys(resultRow).forEach(function (column_name) {
            var field_value = resultRow[column_name];
            t.writeData(column_name, idx, field_value);
        });
    });
    // this is what the multidimensional array looks like
    console.log(
        JSON.stringify(t.data));
    // call the toHTML method of the table to generate an HTML string in web
    // browsers this won't work in node unless you use something like jsdom.
    document.body.appendChild(t.toHTML());
}

//run_example();
