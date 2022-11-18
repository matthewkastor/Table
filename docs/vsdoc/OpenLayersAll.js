
  
/* vsdoc for _global_ */

(function (window) {
    

    window._global_ = {
        /// <summary></summary>
        /// <returns type="_global_"/>
                
    };

    var $x = window._global_;
    $x.__namespace = "true";
    $x.__typeName = "_global_";
})(this);

  

  
  
/* vsdoc for Table */

(function (window) {
    

    window.Table = function(options, options.headings, options.rowLabels, options.data, options.caption){
        /// <summary>Generate HTML tables from two dimensional JavaScript arrays.</summary>
        /// <param name="options" type="Object">An options object.</param>
        /// <param name="options.headings" type="Array">An array of headings as strings or html
        ///  elements. If rowLabels are given then rowLabel[0] will be the first heading.</param>
        /// <param name="options.rowLabels" type="Array">An array of rowLabels as strings or html
        ///  elements. rowLabel[0] will be treated as the top left corner of the table.</param>
        /// <param name="options.data" type="Array">An array (table) of arrays (rows). Elements of
        ///  inner arrays (rows) may contain strings or html elements.</param>
        /// <param name="options.caption" type="String">The table caption.</param>
    };

    var $x = window.Table;
    $x.prototype = {
                
        writeData: function(column, row, data) {
            /// <summary>Write or overwrite data to a specific cell in the table.</summary>
            /// <param name="column" type="Number|String">Index of the row array you want to write to or,
            ///  if you&apos;ve specified heading names you may use the heading name instead.</param>
            /// <param name="row" type="Number|String">Index of the table array where the row array is
            ///  located or, if you&apos;ve specified rowLabels you may use the row label instead.</param>
            /// <param name="data" type="String|HTMLElement">The data to write into the table as either
            ///  a string or an html element.</param>
        }, 
        
        toHTML: function() {
            /// <summary>Generates an HTML table that may be appended to a document.</summary>
            /// <returns type="HTMLTableElement">Returns an HTML table element populated with
            ///  the user specified data, headings, and row labels.</returns>
        }
        
    };

    $x.__class = "true";
    $x.__typeName = "Table";
})(this);


