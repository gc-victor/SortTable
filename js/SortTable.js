
// SortTable.js
// @version 0.1

(function () {

  // Represents the table we are going to sort.
  // @constructor
  // @param {string} id - The <table/> #ID
  // @example var SortTable = new SortTable('tableId');
  // @returns {string}
  SortTable = function (id) {
    this.id = id;
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

  // @param {string} el - Element to be target
  // @param {string} tbody - <tbody/> index to sort
  SortTable.prototype.set = function (el, tbody) {
    var elementTarget = el.target ? el.target : el.srcElement,
      i = 0,
      j = 0,
      cellIndex,
      cached,
      rowsLength = tbody.rows.length,
      rows,
      cellsObj = [],
      dataSortTable,
      newTr;

    console.time('set');

    cellIndex = elementTarget.cellIndex;

    for (i; rowsLength > i; i = i + 1) {
      rows = tbody.rows[i];

      cellsObj.push({
        'key': i,
        'value': rows.cells[cellIndex].innerText,
        'row': rows.innerHTML
      });
    }

    dataSortTable = elementTarget.getAttribute('data-sorttable');

    if (dataSortTable === 'sort') {
      elementTarget.setAttribute('data-sorttable','reverse');
      // Sorting an array of objects
      cellsObj.sort(SortBy.sortObject);
    } else if (dataSortTable === 'reverse') {
      elementTarget.setAttribute('data-sorttable','sort');
      // Sorting array of objects reversed
      cellsObj.sort(SortBy.sortObject).reverse();
    }

    tbody.innerHTML = '';
    for (j; rowsLength > j; j = j + 1) {
      newTr = document.createElement('tr');
      newTr.innerHTML = cellsObj[j].row;
      tbody.appendChild(newTr);
    }

    // Nullify
    tbody = elemente = elementTarget = i  = j =  cellIndex = rows = cellsObj = null;

    console.timeEnd('set');
  };

  SortTable.prototype.sort = function () {
    var self = this,
      thead = self.get('thead');

    SortEvents.bindEvent(thead,
      'click',
      function(el) {
        var tbody = self.get('tbody');
        self.set(el, tbody);
      }
    );
  };
})();

// @exampele:
var SortTable = new SortTable('tableId');
SortTable.sort();