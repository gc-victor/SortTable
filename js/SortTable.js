// SortTable.js
// @version 0.1

(function () {

  // Represents the table we are going to sort.
  // @constructor
  // @param {string} id - The <table/> #ID
  // @example var SortTable = new SortTable('tableId');
  // @returns {string}
  var SortTable = function (id) {
      this.table = document.getElementById(id);
      if (!this.table) {
        throw new Error('Table width id "' + id + '" was not found on the document');
      }
    };

  // @returns {object} - <table/> by it's #ID
  SortTable.prototype.init = function () {
    var self = this,
      thead = self.get('thead');

    self.on('click', thead, function (ev) {
      // get th to sort from current Event object
      var th = ev.target || ev.srcElement,
        tbody = self.get('tbody');

      self.set(th, tbody);
    });
  };

  // extensible sort object
  SortTable.prototype.sortBy = {
    // @returns the index for the current sorted row
    default: function (row1, row2) {
      return row1.value < row2.value ? -1 : row1.value > row2.value ? 1 : 0;
    },

    date: function (row1, row2) {
      // compare dates and return index
    }
  };

  // cross-platform event binding function
  SortTable.prototype.on = function (type, el, handler) {
    if (el.addEventListener) {
      el.addEventListener(type, handler, false);
    } else if (el.attachEvent) {
      el.attachEvent('on' + type, handler);
    }
  };

  // @param {string} el - table child element selectors ('tbody', 'thead', 'tfoot')
  SortTable.prototype.get = function (el) {
    if (el === 'tbody') {
      el = this.table.tBodies[0];

    // get tHead or tFoot
    } else if (el === 'thead' || el === 'tfoot') {
      el = this.table[el.replace(/(\w)(\w)/, function (wholeMatch, m1, m2) { return m1 + m2.toUpperCase() })];
    } else {
      el = null;
    }

    return el;
  };

  // @param {object} th - Native DOM th element
  // @param {object} tbody - Native DOM tbody element
  SortTable.prototype.set = function (th, tbody) {
    var i = 0,
      cellIndex = th.cellIndex,
      rowsLength = tbody.rows.length,
      row,
      cells = [],
      sortType = th.getAttribute('data-sorttable'),
      newTr;

    //console.time('set');

    for (i = 0; rowsLength > i; i += 1) {
      row = tbody.rows[i];

      cells.push({
        value: row.cells[cellIndex].innerText,
        content: row.innerHTML
      });
    }

    // normal sort
    if (sortType !== 'reverse') {
      // set to reverse
      th.setAttribute('data-sorttable', 'reverse');
      // save the sort type
      th.setAttribute('data-sorttype', sortType);
      // sort
      cells.sort(this.sortBy[sortType]);

    // reverse sort
    } else {
      // get the original sort type
      sortType = th.getAttribute('data-sorttype');
      // set the sorttype
      th.setAttribute('data-sorttable', sortType);
      // sort and reverse
      cells.sort(this.sortBy[sortType]).reverse();
    }

    // empty tbody
    tbody.innerHTML = '';
    for (i = 0; rowsLength > i; i += 1) {
      newTr = document.createElement('tr');
      newTr.innerHTML = cells[i].content;
      // populate tbody with sorted rows
      tbody.appendChild(newTr);
    }

    // clear variables that store dom objects reference
    tbody = th = row = null;

    //console.timeEnd('set');
  };

  // expose SortTable to global object
  this.SortTable = SortTable;
}());

// @example:
var SortTable = new SortTable('tableId');
SortTable.init();