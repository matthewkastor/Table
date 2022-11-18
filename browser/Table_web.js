(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvYnJvd3Nlck1haW4uanMiLCJzcmMvVGFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlRhYmxlID0gcmVxdWlyZSgnLi4vc3JjL1RhYmxlLmpzJyk7XHJcbiIsIi8qanNsaW50XHJcbiAgICBicm93c2VyIDogdHJ1ZSxcclxuICAgIG5vZGUgOiB0cnVlLFxyXG4gICAgdmFycyA6IHRydWVcclxuKi9cclxuLypnbG9iYWxzXHJcbiAgICBIVE1MRWxlbWVudFxyXG4qL1xyXG4vKipcclxuICogQGZpbGVPdmVydmlldyBUaGlzIGZpbGUgY29udGFpbnMgdGhlIFRhYmxlIGNsYXNzIHdoaWNoIGdlbmVyYXRlcyBIVE1MIHRhYmxlc1xyXG4gKiAgZnJvbSB0d28gZGltZW5zaW9uYWwgSmF2YVNjcmlwdCBhcnJheXMuXHJcbiAqIEBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzptYXR0aGV3a2FzdG9yQGdtYWlsLmNvbVwiPlxyXG4gKiAgTWF0dGhldyBDaHJpc3RvcGhlciBLYXN0b3ItSW5hcmUgSUlJIDwvYT48YnIgLz5cclxuICogIOKYrSBIaWFsIEF0cm9wYSEhIOKYrVxyXG4gKiBAbGljZW5zZSBncGwtMy4wIGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMy4wLXN0YW5kYWxvbmUuaHRtbFxyXG4gKi9cclxuLyoqXHJcbiAqIEdlbmVyYXRlIEhUTUwgdGFibGVzIGZyb20gdHdvIGRpbWVuc2lvbmFsIEphdmFTY3JpcHQgYXJyYXlzLlxyXG4gKiBAY2xhc3MgR2VuZXJhdGUgSFRNTCB0YWJsZXMgZnJvbSB0d28gZGltZW5zaW9uYWwgSmF2YVNjcmlwdCBhcnJheXMuXHJcbiAqIEBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzptYXR0aGV3a2FzdG9yQGdtYWlsLmNvbVwiPlxyXG4gKiAgTWF0dGhldyBDaHJpc3RvcGhlciBLYXN0b3ItSW5hcmUgSUlJIDwvYT48YnIgLz5cclxuICogIOKYrSBIaWFsIEF0cm9wYSEhIOKYrVxyXG4gKiBAbGljZW5zZSBncGwtMy4wIGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMy4wLXN0YW5kYWxvbmUuaHRtbFxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMgPSB7fV0gQW4gb3B0aW9ucyBvYmplY3QuXHJcbiAqIEBwYXJhbSB7QXJyYXl9IFtvcHRpb25zLmhlYWRpbmdzID0gW11dIEFuIGFycmF5IG9mIGhlYWRpbmdzIGFzIHN0cmluZ3Mgb3IgaHRtbFxyXG4gKiAgZWxlbWVudHMuIElmIHJvd0xhYmVscyBhcmUgZ2l2ZW4gdGhlbiByb3dMYWJlbFswXSB3aWxsIGJlIHRoZSBmaXJzdCBoZWFkaW5nLlxyXG4gKiBAcGFyYW0ge0FycmF5fSBbb3B0aW9ucy5yb3dMYWJlbHMgPSBbXV0gQW4gYXJyYXkgb2Ygcm93TGFiZWxzIGFzIHN0cmluZ3Mgb3IgaHRtbFxyXG4gKiAgZWxlbWVudHMuIHJvd0xhYmVsWzBdIHdpbGwgYmUgdHJlYXRlZCBhcyB0aGUgdG9wIGxlZnQgY29ybmVyIG9mIHRoZSB0YWJsZS5cclxuICogQHBhcmFtIHtBcnJheX0gW29wdGlvbnMuZGF0YSA9IFtdXSBBbiBhcnJheSAodGFibGUpIG9mIGFycmF5cyAocm93cykuIEVsZW1lbnRzIG9mXHJcbiAqICBpbm5lciBhcnJheXMgKHJvd3MpIG1heSBjb250YWluIHN0cmluZ3Mgb3IgaHRtbCBlbGVtZW50cy5cclxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNhcHRpb24gPSAnJ10gVGhlIHRhYmxlIGNhcHRpb24uXHJcbiAqIEBleGFtcGxlXHJcbiAqIHZhciB0aGlyZFNvbWV0aGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2InKTtcclxuICogICAgIHRoaXJkU29tZXRoaW5nLmFwcGVuZENoaWxkKFxyXG4gKiAgICAgICAgIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCd0aGlyZCBzb21ldGhpbmcgaXMgYm9sZCcpKTtcclxuICogXHJcbiAqICB2YXIgdCA9IG5ldyBUYWJsZSh7XHJcbiAqICAgICAgaGVhZGluZ3MgOiBbJ2hlYWRpbmdfMScsICdoZWFkaW5nXzInXSxcclxuICogICAgICByb3dMYWJlbHMgOiBbJyonLCdyb3dfMScsICdyb3dfMiddLFxyXG4gKiAgICAgIGNhcHRpb24gOiAnYW4gZXhhbXBsZSB0YWJsZScsXHJcbiAqICAgICAgZGF0YSA6IFtcclxuICogICAgICAgICAgWydmaXJzdCBzb21ldGhpbmcnLCAnPGI+c2Vjb25kIHNvbWV0aGluZyBpcyBub3QgYm9sZDwvYj4nXSxcclxuICogICAgICAgICAgW3RoaXJkU29tZXRoaW5nLCAnZm91cnRoIHNvbWV0aGluZyddXHJcbiAqICAgICAgXVxyXG4gKiAgfSk7XHJcbiAqICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHQudG9IVE1MKCkpO1xyXG4gKi9cclxuZnVuY3Rpb24gVGFibGUob3B0aW9ucykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICB0aGlzLmhlYWRpbmdzID0gb3B0aW9ucy5oZWFkaW5ncyB8fCBbXTtcclxuICAgIHRoaXMucm93TGFiZWxzID0gb3B0aW9ucy5yb3dMYWJlbHMgfHwgW107XHJcbiAgICB0aGlzLmRhdGEgPSBvcHRpb25zLmRhdGEgfHwgW107XHJcbiAgICB0aGlzLmNhcHRpb24gPSBvcHRpb25zLmNhcHRpb24gfHwgJyc7XHJcbiAgICBpZiAoISh0aGlzLmhlYWRpbmdzIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIFRhYmxlLmhlYWRpbmdzJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoISh0aGlzLnJvd0xhYmVscyBpbnN0YW5jZW9mIEFycmF5KSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBUYWJsZS5yb3dMYWJlbHMnKTtcclxuICAgIH1cclxuICAgIGlmICghKHRoaXMuZGF0YSBpbnN0YW5jZW9mIEFycmF5KSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBUYWJsZS5kYXRhJyk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFdyaXRlIG9yIG92ZXJ3cml0ZSBkYXRhIHRvIGEgc3BlY2lmaWMgY2VsbCBpbiB0aGUgdGFibGUuXHJcbiAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gY29sdW1uIEluZGV4IG9mIHRoZSByb3cgYXJyYXkgeW91IHdhbnQgdG8gd3JpdGUgdG8gb3IsXHJcbiAqICBpZiB5b3UndmUgc3BlY2lmaWVkIGhlYWRpbmcgbmFtZXMgeW91IG1heSB1c2UgdGhlIGhlYWRpbmcgbmFtZSBpbnN0ZWFkLlxyXG4gKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IHJvdyBJbmRleCBvZiB0aGUgdGFibGUgYXJyYXkgd2hlcmUgdGhlIHJvdyBhcnJheSBpc1xyXG4gKiAgbG9jYXRlZCBvciwgaWYgeW91J3ZlIHNwZWNpZmllZCByb3dMYWJlbHMgeW91IG1heSB1c2UgdGhlIHJvdyBsYWJlbCBpbnN0ZWFkLlxyXG4gKiBAcGFyYW0ge1N0cmluZ3xIVE1MRWxlbWVudH0gZGF0YSBUaGUgZGF0YSB0byB3cml0ZSBpbnRvIHRoZSB0YWJsZSBhcyBlaXRoZXJcclxuICogIGEgc3RyaW5nIG9yIGFuIGh0bWwgZWxlbWVudC5cclxuICogXHJcbiAqIEBleGFtcGxlXHJcbiAqICB2YXIgdCA9IG5ldyBUYWJsZSgpO1xyXG4gKiAgdC53cml0ZURhdGEoMSw1LCd0aGlzIGlzIHNvbWUgZGF0YScpO1xyXG4gKiAgY29uc29sZS5sb2codC5kYXRhWzVdWzFdKTsgLy8gbG9ncyAndGhpcyBpcyBzb21lIGRhdGEnXHJcbiAqICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHQudG9IVE1MKCkpO1xyXG4gKiBcclxuICogQGV4YW1wbGVcclxuICogIHZhciB0ID0gbmV3IFRhYmxlKCk7XHJcbiAqICB0LmhlYWRpbmdzID0gWydhbmltYWwnLCAnbmFtZSddO1xyXG4gKiAgdC5yb3dMYWJlbHMgPSBbJ293bmVyJywgJ2ppbScsICdiZXR0eSddO1xyXG4gKiAgdC53cml0ZURhdGEoJ2FuaW1hbCcsICdqaW0nLCAnZG9nJyk7XHJcbiAqICB0LndyaXRlRGF0YSgnbmFtZScsIDAsICdyb29mdXMnKTtcclxuICogIHQud3JpdGVEYXRhKCdhbmltYWwnLCAnYmV0dHknLCAnY2F0Jyk7XHJcbiAqICB0LndyaXRlRGF0YSgxLCAnYmV0dHknLCAnbWV3Jyk7XHJcbiAqICBjb25zb2xlLmxvZyhcclxuICogICAgICBKU09OLnN0cmluZ2lmeSh0LmRhdGEpXHJcbiAqICApO1xyXG4gKiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0LnRvSFRNTCgpKTtcclxuICovXHJcblRhYmxlLnByb3RvdHlwZS53cml0ZURhdGEgPSBmdW5jdGlvbiB3cml0ZURhdGEoY29sdW1uLCByb3csIGRhdGEpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGlmICh0eXBlb2YgY29sdW1uICE9PSAnbnVtYmVyJykge1xyXG4gICAgICAgIGNvbHVtbiA9IHRoaXMuaGVhZGluZ3MuaW5kZXhPZihjb2x1bW4pO1xyXG4gICAgICAgIGlmIChjb2x1bW4gPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2x1bW4nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHJvdyAhPT0gJ251bWJlcicpIHtcclxuICAgICAgICAvLyByb3cgMCBpcyB0aGUgdG9wIGxlZnQgY29ybmVyXHJcbiAgICAgICAgcm93ID0gdGhpcy5yb3dMYWJlbHMuaW5kZXhPZihyb3cpIC0gMTtcclxuICAgICAgICBpZiAocm93IDwgMCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcm93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLmRhdGFbcm93XSkge1xyXG4gICAgICAgIHRoaXMuZGF0YVtyb3ddID0gW107XHJcbiAgICB9XHJcbiAgICB0aGlzLmRhdGFbcm93XVtjb2x1bW5dID0gZGF0YTtcclxufTtcclxuLyoqXHJcbiAqIEdlbmVyYXRlcyBhbiBIVE1MIHRhYmxlIHRoYXQgbWF5IGJlIGFwcGVuZGVkIHRvIGEgZG9jdW1lbnQuXHJcbiAqIEByZXR1cm5zIHtIVE1MVGFibGVFbGVtZW50fSBSZXR1cm5zIGFuIEhUTUwgdGFibGUgZWxlbWVudCBwb3B1bGF0ZWQgd2l0aFxyXG4gKiAgdGhlIHVzZXIgc3BlY2lmaWVkIGRhdGEsIGhlYWRpbmdzLCBhbmQgcm93IGxhYmVscy5cclxuICogXHJcbiAqIEBleGFtcGxlXHJcbiAqICB2YXIgdCA9IG5ldyBUYWJsZSgpO1xyXG4gKiAgdC5oZWFkaW5ncyA9IFsnYW5pbWFsJywgJ25hbWUnXTtcclxuICogIHQucm93TGFiZWxzID0gWydvd25lcicsICdqaW0nLCAnYmV0dHknXTtcclxuICogIHQud3JpdGVEYXRhKCdhbmltYWwnLCAnamltJywgJ2RvZycpO1xyXG4gKiAgdC53cml0ZURhdGEoJ25hbWUnLCAwLCAncm9vZnVzJyk7XHJcbiAqICB0LndyaXRlRGF0YSgnYW5pbWFsJywgJ2JldHR5JywgJ2NhdCcpO1xyXG4gKiAgdC53cml0ZURhdGEoMSwgJ2JldHR5JywgJ21ldycpO1xyXG4gKiAgY29uc29sZS5sb2coXHJcbiAqICAgICAgSlNPTi5zdHJpbmdpZnkodC5kYXRhKVxyXG4gKiAgKTtcclxuICogIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodC50b0hUTUwoKSk7XHJcbiAqL1xyXG5UYWJsZS5wcm90b3R5cGUudG9IVE1MID0gZnVuY3Rpb24gdG9IVE1MKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIHRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGFibGUnKTtcclxuICAgIHZhciBoYXNSb3dMYWJlbHMgPSB0aGlzLnJvd0xhYmVscy5sZW5ndGggPiAwID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgdmFyIGhhc0RhdGEgPSB0aGlzLmRhdGEubGVuZ3RoID4gMCA/IHRydWUgOiBmYWxzZTtcclxuICAgIHZhciB0b3BsZWZ0ID0gdGhpcy5yb3dMYWJlbHNbMF0gfHwgJyc7XHJcbiAgICB2YXIgY2FwdGlvbiwgdGJvZHksIHRoZWFkLCB0ciwgdGQsIHRleHQsIHJvd3NjdCwgY2VsbHNjdCwgeCwgeSwgZGF0YTtcclxuICAgIGNhcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYXB0aW9uJyk7XHJcbiAgICB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy5jYXB0aW9uKTtcclxuICAgIGNhcHRpb24uYXBwZW5kQ2hpbGQodGV4dCk7XHJcbiAgICB0YWJsZS5hcHBlbmRDaGlsZChjYXB0aW9uKTtcclxuICAgIC8vIGhlYWRpbmdzXHJcbiAgICB0aGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RoZWFkJyk7XHJcbiAgICB0ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XHJcbiAgICB0aGVhZC5hcHBlbmRDaGlsZCh0cik7XHJcbiAgICBpZiAoaGFzUm93TGFiZWxzKSB7XHJcbiAgICAgICAgdGhpcy5oZWFkaW5ncy51bnNoaWZ0KHRvcGxlZnQpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5oZWFkaW5ncy5mb3JFYWNoKGZ1bmN0aW9uIChoZWFkaW5nKSB7XHJcbiAgICAgICAgdGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgIGlmIChoZWFkaW5nIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGQuYXBwZW5kQ2hpbGQoaGVhZGluZyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGhlYWRpbmcudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHRkLmFwcGVuZENoaWxkKHRleHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ci5hcHBlbmRDaGlsZCh0ZCk7XHJcbiAgICB9KTtcclxuICAgIGlmIChoYXNSb3dMYWJlbHMpIHtcclxuICAgICAgICB0aGlzLmhlYWRpbmdzLnNoaWZ0KCk7XHJcbiAgICB9XHJcbiAgICB0aGVhZC5hcHBlbmRDaGlsZCh0cik7XHJcbiAgICB0YWJsZS5hcHBlbmRDaGlsZCh0aGVhZCk7XHJcbiAgICAvLyByb3dzXHJcbiAgICBpZiAoaGFzRGF0YSkge1xyXG4gICAgICAgIHRib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGJvZHknKTtcclxuICAgICAgICByb3dzY3QgPSB0aGlzLmRhdGEubGVuZ3RoO1xyXG4gICAgICAgIGZvciAoeCA9IDA7IHggPCByb3dzY3Q7IHggKz0gMSkge1xyXG4gICAgICAgICAgICB0ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XHJcbiAgICAgICAgICAgIC8vIGNlbGxzXHJcbiAgICAgICAgICAgIGlmIChoYXNSb3dMYWJlbHMpIHtcclxuICAgICAgICAgICAgICAgIC8vIHJvdyAwIGlzIHRvcCBsZWZ0IGNvcm5lclxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVt4XSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW3hdLnVuc2hpZnQodGhpcy5yb3dMYWJlbHNbeCArIDFdIHx8ICcnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW3hdID0gW3RoaXMucm93TGFiZWxzW3ggKyAxXSB8fCAnJ107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2VsbHNjdCA9IHRoaXMuZGF0YVt4XSA/IHRoaXMuZGF0YVt4XS5sZW5ndGggOiAwO1xyXG4gICAgICAgICAgICBmb3IgKHkgPSAwOyB5IDwgY2VsbHNjdDsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5kYXRhW3hdID8gdGhpcy5kYXRhW3hdW3ldIDogJyc7XHJcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YSB8fCAnJztcclxuICAgICAgICAgICAgICAgIHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZC5hcHBlbmRDaGlsZChkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGQuYXBwZW5kQ2hpbGQodGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0ci5hcHBlbmRDaGlsZCh0ZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGhhc1Jvd0xhYmVscykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW3hdLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGJvZHkuYXBwZW5kQ2hpbGQodHIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YWJsZS5hcHBlbmRDaGlsZCh0Ym9keSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGFibGU7XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gVGFibGU7Il19
