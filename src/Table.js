/*jslint
    browser : true,
    node : true,
    vars : true
*/
/*globals
    HTMLElement
*/
/**
 * @fileOverview This file contains the Table class which generates HTML tables
 *  from two dimensional JavaScript arrays.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 * @license gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html
 */
/**
 * Generate HTML tables from two dimensional JavaScript arrays.
 * @class Generate HTML tables from two dimensional JavaScript arrays.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 * @license gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html
 * @param {Object} [options = {}] An options object.
 * @param {Array} [options.headings = []] An array of headings as strings or html
 *  elements. If rowLabels are given then rowLabel[0] will be the first heading.
 * @param {Array} [options.rowLabels = []] An array of rowLabels as strings or html
 *  elements. rowLabel[0] will be treated as the top left corner of the table.
 * @param {Array} [options.data = []] An array (table) of arrays (rows). Elements of
 *  inner arrays (rows) may contain strings or html elements.
 * @param {String} [options.caption = ''] The table caption.
 * @example
 * var thirdSomething = document.createElement('b');
 *     thirdSomething.appendChild(
 *         document.createTextNode('third something is bold'));
 * 
 *  var t = new Table({
 *      headings : ['heading_1', 'heading_2'],
 *      rowLabels : ['*','row_1', 'row_2'],
 *      caption : 'an example table',
 *      data : [
 *          ['first something', '<b>second something is not bold</b>'],
 *          [thirdSomething, 'fourth something']
 *      ]
 *  });
 *  document.body.appendChild(t.toHTML());
 */
function Table(options) {
    'use strict';
    options = options || {};
    this.headings = options.headings || [];
    this.rowLabels = options.rowLabels || [];
    this.data = options.data || [];
    this.caption = options.caption || '';
    if (!(this.headings instanceof Array)) {
        throw new Error('invalid Table.headings');
    }
    if (!(this.rowLabels instanceof Array)) {
        throw new Error('invalid Table.rowLabels');
    }
    if (!(this.data instanceof Array)) {
        throw new Error('invalid Table.data');
    }
}
/**
 * Write or overwrite data to a specific cell in the table.
 * @param {Number|String} column Index of the row array you want to write to or,
 *  if you've specified heading names you may use the heading name instead.
 * @param {Number|String} row Index of the table array where the row array is
 *  located or, if you've specified rowLabels you may use the row label instead.
 * @param {String|HTMLElement} data The data to write into the table as either
 *  a string or an html element.
 * 
 * @example
 *  var t = new Table();
 *  t.writeData(1,5,'this is some data');
 *  console.log(t.data[5][1]); // logs 'this is some data'
 *  document.body.appendChild(t.toHTML());
 * 
 * @example
 *  var t = new Table();
 *  t.headings = ['animal', 'name'];
 *  t.rowLabels = ['owner', 'jim', 'betty'];
 *  t.writeData('animal', 'jim', 'dog');
 *  t.writeData('name', 0, 'roofus');
 *  t.writeData('animal', 'betty', 'cat');
 *  t.writeData(1, 'betty', 'mew');
 *  console.log(
 *      JSON.stringify(t.data)
 *  );
 *  document.body.appendChild(t.toHTML());
 */
Table.prototype.writeData = function writeData(column, row, data) {
    'use strict';
    if (typeof column !== 'number') {
        column = this.headings.indexOf(column);
        if (column === -1) {
            throw new Error('Invalid column');
        }
    }
    if (typeof row !== 'number') {
        // row 0 is the top left corner
        row = this.rowLabels.indexOf(row) - 1;
        if (row < 0) {
            throw new Error('Invalid row');
        }
    }
    if (!this.data[row]) {
        this.data[row] = [];
    }
    this.data[row][column] = data;
};
/**
 * Generates an HTML table that may be appended to a document.
 * @returns {HTMLTableElement} Returns an HTML table element populated with
 *  the user specified data, headings, and row labels.
 * 
 * @example
 *  var t = new Table();
 *  t.headings = ['animal', 'name'];
 *  t.rowLabels = ['owner', 'jim', 'betty'];
 *  t.writeData('animal', 'jim', 'dog');
 *  t.writeData('name', 0, 'roofus');
 *  t.writeData('animal', 'betty', 'cat');
 *  t.writeData(1, 'betty', 'mew');
 *  console.log(
 *      JSON.stringify(t.data)
 *  );
 *  document.body.appendChild(t.toHTML());
 */
Table.prototype.toHTML = function toHTML() {
    'use strict';
    var table = document.createElement('table');
    var hasRowLabels = this.rowLabels.length > 0 ? true : false;
    var hasData = this.data.length > 0 ? true : false;
    var topleft = this.rowLabels[0] || '';
    var caption, tbody, thead, tr, td, text, rowsct, cellsct, x, y, data;
    caption = document.createElement('caption');
    text = document.createTextNode(this.caption);
    caption.appendChild(text);
    table.appendChild(caption);
    // headings
    thead = document.createElement('thead');
    tr = document.createElement('tr');
    thead.appendChild(tr);
    if (hasRowLabels) {
        this.headings.unshift(topleft);
    }
    this.headings.forEach(function (heading) {
        td = document.createElement('td');
        if (heading instanceof HTMLElement) {
            td.appendChild(heading);
        } else {
            text = document.createTextNode(heading.toString());
            td.appendChild(text);
        }
        tr.appendChild(td);
    });
    if (hasRowLabels) {
        this.headings.shift();
    }
    thead.appendChild(tr);
    table.appendChild(thead);
    // rows
    if (hasData) {
        tbody = document.createElement('tbody');
        rowsct = this.data.length;
        for (x = 0; x < rowsct; x += 1) {
            tr = document.createElement('tr');
            // cells
            if (hasRowLabels) {
                // row 0 is top left corner
                if (this.data[x] instanceof Array) {
                    this.data[x].unshift(this.rowLabels[x + 1] || '');
                } else {
                    this.data[x] = [this.rowLabels[x + 1] || ''];
                }
            }
            cellsct = this.data[x] ? this.data[x].length : 0;
            for (y = 0; y < cellsct; y += 1) {
                data = this.data[x] ? this.data[x][y] : '';
                data = data || '';
                td = document.createElement('td');
                if (data instanceof HTMLElement) {
                    td.appendChild(data);
                } else {
                    text = document.createTextNode(data.toString());
                    td.appendChild(text);
                }
                tr.appendChild(td);
            }
            if (hasRowLabels) {
                this.data[x].shift();
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
    }
    return table;
};
module.exports = Table;