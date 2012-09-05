// SortTable.js
// @version 0.1

(function () {

  // Represents the table we are going to sort.
  // @constructor
  // @param {string} id - The <table/> #ID
  // @example var SortTable = new SortTable('tableId');
  // @returns {string}
  this.SortTable = function (id) {
    // auto-create a new instance without the 'new' keyword
    if (!(this instanceof SortTable)) {
      return new this.SortTable(id);
    }

    // get html table
    this.table = document.getElementById(id);
    if (!this.table) {
      throw new Error('Table width id "' + id + '" was not found on the document');
    }

    // check if plugin already initialized
    if (this.table.sortTable) {
      return this.table.sortTable;
    }

    return this.init();
  };

  // @returns {object} - <table/> by it's #ID
  SortTable.prototype.init = function () {
    var self = this;

    this.thead = this.get('thead');
    this.tbody = this.get('tbody');

    this.handler = function (ev) {
      // get th to sort from current Event object
      var th = ev.target || ev.srcElement;

      self.set(th);
    };

    // register handler
    this.on('click', this.thead, this.handler);

    // mark plugin as initialized
    // saving reference to the instance
    this.table.sortTable = this;

    return this;
  };

  // destroy the plugin
  SortTable.prototype.destroy = function () {
    this.off('click', this.thead, this.handler);
    this.table.sortTable = undefined;
  };

  // extensible sort object
  SortTable.prototype.sortBy = {
    // @returns the index for the current sorted row
    'default': function (row1, row2) {
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

  SortTable.prototype.off = function (type, el, handler) {
    if (el.removeEventListener) {
      el.removeEventListener(type, handler, false);
    } else if (el.attachEvent) {
      el.detachEvent('on' + type, handler);
    }
  };

  // @param {string} el - table child element selectors ('tbody', 'thead', 'tfoot')
  SortTable.prototype.get = function (el) {
    if (el === 'tbody') {
      el = this.table.tBodies[0];

    // get tHead or tFoot
    } else if (el === 'thead' || el === 'tfoot') {
      el = this.table[el.replace(/(\w)(\w)/, function (wholeMatch, m1, m2) { return m1 + m2.toUpperCase(); })];
    } else {
      el = null;
    }

    return el;
  };

  // @param {object} th - Native DOM th element
  // @param {object} tbody - Native DOM tbody element
  SortTable.prototype.set = function (th) {
    var tbody = this.tbody,
      i,
      cellIndex = th.cellIndex,
      rowsLength = tbody.rows.length,
      totalRows = rowsLength,
      row,
      cells = [],
      sortType = th.getAttribute('data-sorttable'),
      reverse = th.getAttribute('data-reverse') === 'true' ? true : false,
      newTr;

    //console.time('set');

    for (i = 0; rowsLength > i; i += 1) {
      row = tbody.rows[i];

      cells.push({
        value: row.cells[cellIndex].innerText,
        content: row.innerHTML
      });
    }

    // toggle reverse status
    th.setAttribute('data-reverse', !reverse);

    // sort
    cells.sort(this.sortBy[sortType]);

    // reverse if needed
    if (reverse) {
      cells.reverse();
    }

    for (i = 0; rowsLength > i; i += 1) {
      // innerHTML doesn't work on IE to empty the table, use deleteRow instead
      tbody.deleteRow(--totalRows);
      // create new tr element
      newTr = document.createElement('tr');
      // TODO: IE doesn't support innerHTML on tr elements
      newTr.innerHTML = cells[i].content;
      // populate tbody with current tr
      tbody.appendChild(newTr);
    }

    // clear variables that store dom objects reference
    tbody = th = row = null;

    //console.timeEnd('set');
  };

}());