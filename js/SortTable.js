// SortTable.js
// @version 0.1

(function () {

  // Represents the table we are going to sort.
  // @constructor
  // @param {string} id - The <table/> #ID
  // @example var SortTable = new SortTable('tableId');
  // @returns {string}
  var SortTable = function (id) {
      this.id = id;
    },
    // returns the index for the current sorted row
    sortingFunction = function (row1, row2) {
      return row1.value < row2.value ? -1 : row1.value > row2.value ? 1 : 0;
    };

  // @returns {object} - <table/> by it's #ID
  SortTable.prototype.init = function () {
    var table = document.getElementById(this.id),
      isTable = table.tagName === 'TABLE' ? table : null;

    try {
      return isTable;
    } finally {
      table = isTable = null;
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

  // @param {string} el - A <table/> child elements ('tbody', 'thead', 'tfoot')
  SortTable.prototype.get = function (el) {
    if (el === 'tbody') {
      el = this.init().tBodies[0];
    } else if (el === 'thead') {
      el = this.init().tHead;
    } else if (el === 'tfoot') {
      el = this.init().tFoot;
    } else {
      el = null;
    }

    try {
      return el;
    } finally {
      el = null;
    }
  };

  // @param {object} el - Event Object
  // @param {object} tbody - Native DOM tbody object
  SortTable.prototype.set = function (th, tbody) {
    var i = 0,
      j = 0,
      cellIndex = th.cellIndex,
      rowsLength = tbody.rows.length,
      row,
      cells = [],
      dataSortTable = th.getAttribute('data-sorttable'),
      newTr;

    //console.time('set');

    for (i; rowsLength > i; i += 1) {
      row = tbody.rows[i];

      cells.push({
        value: row.cells[cellIndex].innerText,
        row: row.innerHTML
      });
    }

    // Sorting an array of objects
    if (dataSortTable === 'sort') {
      th.setAttribute('data-sorttable', 'reverse');
      cells.sort(sortingFunction);

    // Sorting array of objects reversed
    } else if (dataSortTable === 'reverse') {
      th.setAttribute('data-sorttable', 'sort');
      cells.sort(sortingFunction).reverse();
    }

    tbody.innerHTML = '';
    for (j; rowsLength > j; j = j + 1) {
      newTr = document.createElement('tr');
      newTr.innerHTML = cells[j].row;
      tbody.appendChild(newTr);
    }

    // clear variables that store dom objects reference
    tbody = th = row = null;

    //console.timeEnd('set');
  };

  SortTable.prototype.sort = function () {
    var self = this,
      thead = self.get('thead');

    self.on('click', thead, function (ev) {
      // get th to sort from current Event object
      var th = ev.target || ev.srcElement,
        tbody = self.get('tbody');

      self.set(th, tbody);
    });
  };

  // expose SortTable to global object
  this.SortTable = SortTable;
}());

// @example:
var SortTable = new SortTable('tableId');
SortTable.sort();