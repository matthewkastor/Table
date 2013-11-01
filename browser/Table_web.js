;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Table = require('../src/Table.js');

},{"../src/Table.js":2}],2:[function(require,module,exports){
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
},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOi9Vc2Vycy9rYXN0b3IvRGVza3RvcC9leHBlcmltZW50cy9UYWJsZS9kZXYvYnJvd3Nlck1haW4uanMiLCJDOi9Vc2Vycy9rYXN0b3IvRGVza3RvcC9leHBlcmltZW50cy9UYWJsZS9zcmMvVGFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiVGFibGUgPSByZXF1aXJlKCcuLi9zcmMvVGFibGUuanMnKTtcclxuIiwiLypqc2xpbnRcclxuICAgIGJyb3dzZXIgOiB0cnVlLFxyXG4gICAgbm9kZSA6IHRydWUsXHJcbiAgICB2YXJzIDogdHJ1ZVxyXG4qL1xyXG4vKmdsb2JhbHNcclxuICAgIEhUTUxFbGVtZW50XHJcbiovXHJcbi8qKlxyXG4gKiBAZmlsZU92ZXJ2aWV3IFRoaXMgZmlsZSBjb250YWlucyB0aGUgVGFibGUgY2xhc3Mgd2hpY2ggZ2VuZXJhdGVzIEhUTUwgdGFibGVzXHJcbiAqICBmcm9tIHR3byBkaW1lbnNpb25hbCBKYXZhU2NyaXB0IGFycmF5cy5cclxuICogQGF1dGhvciA8YSBocmVmPVwibWFpbHRvOm1hdHRoZXdrYXN0b3JAZ21haWwuY29tXCI+XHJcbiAqICBNYXR0aGV3IENocmlzdG9waGVyIEthc3Rvci1JbmFyZSBJSUkgPC9hPjxiciAvPlxyXG4gKiAg4pitIEhpYWwgQXRyb3BhISEg4pitXHJcbiAqIEBsaWNlbnNlIGdwbC0zLjAgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0zLjAtc3RhbmRhbG9uZS5odG1sXHJcbiAqL1xyXG4vKipcclxuICogR2VuZXJhdGUgSFRNTCB0YWJsZXMgZnJvbSB0d28gZGltZW5zaW9uYWwgSmF2YVNjcmlwdCBhcnJheXMuXHJcbiAqIEBjbGFzcyBHZW5lcmF0ZSBIVE1MIHRhYmxlcyBmcm9tIHR3byBkaW1lbnNpb25hbCBKYXZhU2NyaXB0IGFycmF5cy5cclxuICogQGF1dGhvciA8YSBocmVmPVwibWFpbHRvOm1hdHRoZXdrYXN0b3JAZ21haWwuY29tXCI+XHJcbiAqICBNYXR0aGV3IENocmlzdG9waGVyIEthc3Rvci1JbmFyZSBJSUkgPC9hPjxiciAvPlxyXG4gKiAg4pitIEhpYWwgQXRyb3BhISEg4pitXHJcbiAqIEBsaWNlbnNlIGdwbC0zLjAgaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0zLjAtc3RhbmRhbG9uZS5odG1sXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucyA9IHt9XSBBbiBvcHRpb25zIG9iamVjdC5cclxuICogQHBhcmFtIHtBcnJheX0gW29wdGlvbnMuaGVhZGluZ3MgPSBbXV0gQW4gYXJyYXkgb2YgaGVhZGluZ3MgYXMgc3RyaW5ncyBvciBodG1sXHJcbiAqICBlbGVtZW50cy4gSWYgcm93TGFiZWxzIGFyZSBnaXZlbiB0aGVuIHJvd0xhYmVsWzBdIHdpbGwgYmUgdGhlIGZpcnN0IGhlYWRpbmcuXHJcbiAqIEBwYXJhbSB7QXJyYXl9IFtvcHRpb25zLnJvd0xhYmVscyA9IFtdXSBBbiBhcnJheSBvZiByb3dMYWJlbHMgYXMgc3RyaW5ncyBvciBodG1sXHJcbiAqICBlbGVtZW50cy4gcm93TGFiZWxbMF0gd2lsbCBiZSB0cmVhdGVkIGFzIHRoZSB0b3AgbGVmdCBjb3JuZXIgb2YgdGhlIHRhYmxlLlxyXG4gKiBAcGFyYW0ge0FycmF5fSBbb3B0aW9ucy5kYXRhID0gW11dIEFuIGFycmF5ICh0YWJsZSkgb2YgYXJyYXlzIChyb3dzKS4gRWxlbWVudHMgb2ZcclxuICogIGlubmVyIGFycmF5cyAocm93cykgbWF5IGNvbnRhaW4gc3RyaW5ncyBvciBodG1sIGVsZW1lbnRzLlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY2FwdGlvbiA9ICcnXSBUaGUgdGFibGUgY2FwdGlvbi5cclxuICogQGV4YW1wbGVcclxuICogdmFyIHRoaXJkU29tZXRoaW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYicpO1xyXG4gKiAgICAgdGhpcmRTb21ldGhpbmcuYXBwZW5kQ2hpbGQoXHJcbiAqICAgICAgICAgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ3RoaXJkIHNvbWV0aGluZyBpcyBib2xkJykpO1xyXG4gKiBcclxuICogIHZhciB0ID0gbmV3IFRhYmxlKHtcclxuICogICAgICBoZWFkaW5ncyA6IFsnaGVhZGluZ18xJywgJ2hlYWRpbmdfMiddLFxyXG4gKiAgICAgIHJvd0xhYmVscyA6IFsnKicsJ3Jvd18xJywgJ3Jvd18yJ10sXHJcbiAqICAgICAgY2FwdGlvbiA6ICdhbiBleGFtcGxlIHRhYmxlJyxcclxuICogICAgICBkYXRhIDogW1xyXG4gKiAgICAgICAgICBbJ2ZpcnN0IHNvbWV0aGluZycsICc8Yj5zZWNvbmQgc29tZXRoaW5nIGlzIG5vdCBib2xkPC9iPiddLFxyXG4gKiAgICAgICAgICBbdGhpcmRTb21ldGhpbmcsICdmb3VydGggc29tZXRoaW5nJ11cclxuICogICAgICBdXHJcbiAqICB9KTtcclxuICogIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodC50b0hUTUwoKSk7XHJcbiAqL1xyXG5mdW5jdGlvbiBUYWJsZShvcHRpb25zKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIHRoaXMuaGVhZGluZ3MgPSBvcHRpb25zLmhlYWRpbmdzIHx8IFtdO1xyXG4gICAgdGhpcy5yb3dMYWJlbHMgPSBvcHRpb25zLnJvd0xhYmVscyB8fCBbXTtcclxuICAgIHRoaXMuZGF0YSA9IG9wdGlvbnMuZGF0YSB8fCBbXTtcclxuICAgIHRoaXMuY2FwdGlvbiA9IG9wdGlvbnMuY2FwdGlvbiB8fCAnJztcclxuICAgIGlmICghKHRoaXMuaGVhZGluZ3MgaW5zdGFuY2VvZiBBcnJheSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgVGFibGUuaGVhZGluZ3MnKTtcclxuICAgIH1cclxuICAgIGlmICghKHRoaXMucm93TGFiZWxzIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIFRhYmxlLnJvd0xhYmVscycpO1xyXG4gICAgfVxyXG4gICAgaWYgKCEodGhpcy5kYXRhIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIFRhYmxlLmRhdGEnKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogV3JpdGUgb3Igb3ZlcndyaXRlIGRhdGEgdG8gYSBzcGVjaWZpYyBjZWxsIGluIHRoZSB0YWJsZS5cclxuICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBjb2x1bW4gSW5kZXggb2YgdGhlIHJvdyBhcnJheSB5b3Ugd2FudCB0byB3cml0ZSB0byBvcixcclxuICogIGlmIHlvdSd2ZSBzcGVjaWZpZWQgaGVhZGluZyBuYW1lcyB5b3UgbWF5IHVzZSB0aGUgaGVhZGluZyBuYW1lIGluc3RlYWQuXHJcbiAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gcm93IEluZGV4IG9mIHRoZSB0YWJsZSBhcnJheSB3aGVyZSB0aGUgcm93IGFycmF5IGlzXHJcbiAqICBsb2NhdGVkIG9yLCBpZiB5b3UndmUgc3BlY2lmaWVkIHJvd0xhYmVscyB5b3UgbWF5IHVzZSB0aGUgcm93IGxhYmVsIGluc3RlYWQuXHJcbiAqIEBwYXJhbSB7U3RyaW5nfEhUTUxFbGVtZW50fSBkYXRhIFRoZSBkYXRhIHRvIHdyaXRlIGludG8gdGhlIHRhYmxlIGFzIGVpdGhlclxyXG4gKiAgYSBzdHJpbmcgb3IgYW4gaHRtbCBlbGVtZW50LlxyXG4gKiBcclxuICogQGV4YW1wbGVcclxuICogIHZhciB0ID0gbmV3IFRhYmxlKCk7XHJcbiAqICB0LndyaXRlRGF0YSgxLDUsJ3RoaXMgaXMgc29tZSBkYXRhJyk7XHJcbiAqICBjb25zb2xlLmxvZyh0LmRhdGFbNV1bMV0pOyAvLyBsb2dzICd0aGlzIGlzIHNvbWUgZGF0YSdcclxuICogIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodC50b0hUTUwoKSk7XHJcbiAqIFxyXG4gKiBAZXhhbXBsZVxyXG4gKiAgdmFyIHQgPSBuZXcgVGFibGUoKTtcclxuICogIHQuaGVhZGluZ3MgPSBbJ2FuaW1hbCcsICduYW1lJ107XHJcbiAqICB0LnJvd0xhYmVscyA9IFsnb3duZXInLCAnamltJywgJ2JldHR5J107XHJcbiAqICB0LndyaXRlRGF0YSgnYW5pbWFsJywgJ2ppbScsICdkb2cnKTtcclxuICogIHQud3JpdGVEYXRhKCduYW1lJywgMCwgJ3Jvb2Z1cycpO1xyXG4gKiAgdC53cml0ZURhdGEoJ2FuaW1hbCcsICdiZXR0eScsICdjYXQnKTtcclxuICogIHQud3JpdGVEYXRhKDEsICdiZXR0eScsICdtZXcnKTtcclxuICogIGNvbnNvbGUubG9nKFxyXG4gKiAgICAgIEpTT04uc3RyaW5naWZ5KHQuZGF0YSlcclxuICogICk7XHJcbiAqICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHQudG9IVE1MKCkpO1xyXG4gKi9cclxuVGFibGUucHJvdG90eXBlLndyaXRlRGF0YSA9IGZ1bmN0aW9uIHdyaXRlRGF0YShjb2x1bW4sIHJvdywgZGF0YSkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgaWYgKHR5cGVvZiBjb2x1bW4gIT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgY29sdW1uID0gdGhpcy5oZWFkaW5ncy5pbmRleE9mKGNvbHVtbik7XHJcbiAgICAgICAgaWYgKGNvbHVtbiA9PT0gLTEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbHVtbicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygcm93ICE9PSAnbnVtYmVyJykge1xyXG4gICAgICAgIC8vIHJvdyAwIGlzIHRoZSB0b3AgbGVmdCBjb3JuZXJcclxuICAgICAgICByb3cgPSB0aGlzLnJvd0xhYmVscy5pbmRleE9mKHJvdykgLSAxO1xyXG4gICAgICAgIGlmIChyb3cgPCAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCByb3cnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuZGF0YVtyb3ddKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhW3Jvd10gPSBbXTtcclxuICAgIH1cclxuICAgIHRoaXMuZGF0YVtyb3ddW2NvbHVtbl0gPSBkYXRhO1xyXG59O1xyXG4vKipcclxuICogR2VuZXJhdGVzIGFuIEhUTUwgdGFibGUgdGhhdCBtYXkgYmUgYXBwZW5kZWQgdG8gYSBkb2N1bWVudC5cclxuICogQHJldHVybnMge0hUTUxUYWJsZUVsZW1lbnR9IFJldHVybnMgYW4gSFRNTCB0YWJsZSBlbGVtZW50IHBvcHVsYXRlZCB3aXRoXHJcbiAqICB0aGUgdXNlciBzcGVjaWZpZWQgZGF0YSwgaGVhZGluZ3MsIGFuZCByb3cgbGFiZWxzLlxyXG4gKiBcclxuICogQGV4YW1wbGVcclxuICogIHZhciB0ID0gbmV3IFRhYmxlKCk7XHJcbiAqICB0LmhlYWRpbmdzID0gWydhbmltYWwnLCAnbmFtZSddO1xyXG4gKiAgdC5yb3dMYWJlbHMgPSBbJ293bmVyJywgJ2ppbScsICdiZXR0eSddO1xyXG4gKiAgdC53cml0ZURhdGEoJ2FuaW1hbCcsICdqaW0nLCAnZG9nJyk7XHJcbiAqICB0LndyaXRlRGF0YSgnbmFtZScsIDAsICdyb29mdXMnKTtcclxuICogIHQud3JpdGVEYXRhKCdhbmltYWwnLCAnYmV0dHknLCAnY2F0Jyk7XHJcbiAqICB0LndyaXRlRGF0YSgxLCAnYmV0dHknLCAnbWV3Jyk7XHJcbiAqICBjb25zb2xlLmxvZyhcclxuICogICAgICBKU09OLnN0cmluZ2lmeSh0LmRhdGEpXHJcbiAqICApO1xyXG4gKiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0LnRvSFRNTCgpKTtcclxuICovXHJcblRhYmxlLnByb3RvdHlwZS50b0hUTUwgPSBmdW5jdGlvbiB0b0hUTUwoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0YWJsZScpO1xyXG4gICAgdmFyIGhhc1Jvd0xhYmVscyA9IHRoaXMucm93TGFiZWxzLmxlbmd0aCA+IDAgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB2YXIgaGFzRGF0YSA9IHRoaXMuZGF0YS5sZW5ndGggPiAwID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgdmFyIHRvcGxlZnQgPSB0aGlzLnJvd0xhYmVsc1swXSB8fCAnJztcclxuICAgIHZhciBjYXB0aW9uLCB0Ym9keSwgdGhlYWQsIHRyLCB0ZCwgdGV4dCwgcm93c2N0LCBjZWxsc2N0LCB4LCB5LCBkYXRhO1xyXG4gICAgY2FwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhcHRpb24nKTtcclxuICAgIHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLmNhcHRpb24pO1xyXG4gICAgY2FwdGlvbi5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICAgIHRhYmxlLmFwcGVuZENoaWxkKGNhcHRpb24pO1xyXG4gICAgLy8gaGVhZGluZ3NcclxuICAgIHRoZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGhlYWQnKTtcclxuICAgIHRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcclxuICAgIHRoZWFkLmFwcGVuZENoaWxkKHRyKTtcclxuICAgIGlmIChoYXNSb3dMYWJlbHMpIHtcclxuICAgICAgICB0aGlzLmhlYWRpbmdzLnVuc2hpZnQodG9wbGVmdCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmhlYWRpbmdzLmZvckVhY2goZnVuY3Rpb24gKGhlYWRpbmcpIHtcclxuICAgICAgICB0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgaWYgKGhlYWRpbmcgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0ZC5hcHBlbmRDaGlsZChoZWFkaW5nKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaGVhZGluZy50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgdGQuYXBwZW5kQ2hpbGQodGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyLmFwcGVuZENoaWxkKHRkKTtcclxuICAgIH0pO1xyXG4gICAgaWYgKGhhc1Jvd0xhYmVscykge1xyXG4gICAgICAgIHRoaXMuaGVhZGluZ3Muc2hpZnQoKTtcclxuICAgIH1cclxuICAgIHRoZWFkLmFwcGVuZENoaWxkKHRyKTtcclxuICAgIHRhYmxlLmFwcGVuZENoaWxkKHRoZWFkKTtcclxuICAgIC8vIHJvd3NcclxuICAgIGlmIChoYXNEYXRhKSB7XHJcbiAgICAgICAgdGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0Ym9keScpO1xyXG4gICAgICAgIHJvd3NjdCA9IHRoaXMuZGF0YS5sZW5ndGg7XHJcbiAgICAgICAgZm9yICh4ID0gMDsgeCA8IHJvd3NjdDsgeCArPSAxKSB7XHJcbiAgICAgICAgICAgIHRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcclxuICAgICAgICAgICAgLy8gY2VsbHNcclxuICAgICAgICAgICAgaWYgKGhhc1Jvd0xhYmVscykge1xyXG4gICAgICAgICAgICAgICAgLy8gcm93IDAgaXMgdG9wIGxlZnQgY29ybmVyXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhW3hdIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbeF0udW5zaGlmdCh0aGlzLnJvd0xhYmVsc1t4ICsgMV0gfHwgJycpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbeF0gPSBbdGhpcy5yb3dMYWJlbHNbeCArIDFdIHx8ICcnXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjZWxsc2N0ID0gdGhpcy5kYXRhW3hdID8gdGhpcy5kYXRhW3hdLmxlbmd0aCA6IDA7XHJcbiAgICAgICAgICAgIGZvciAoeSA9IDA7IHkgPCBjZWxsc2N0OyB5ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLmRhdGFbeF0gPyB0aGlzLmRhdGFbeF1beV0gOiAnJztcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhIHx8ICcnO1xyXG4gICAgICAgICAgICAgICAgdGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRkLmFwcGVuZENoaWxkKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICB0ZC5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRyLmFwcGVuZENoaWxkKHRkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaGFzUm93TGFiZWxzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbeF0uc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0Ym9keS5hcHBlbmRDaGlsZCh0cik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhYmxlLmFwcGVuZENoaWxkKHRib2R5KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0YWJsZTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZTsiXX0=
;