// SortTable.js
// @version 0.1

(function () {

  // Represents the table we are going to sort.
  // @constructor
  // @example SortTable();
  // @returns {string}
  this.SortTable = function () {
    // auto-create a new instance without the 'new' keyword
    if (!(this instanceof SortTable)) {
      return new this.SortTable();
    }

    return this.init();
  };

  // @returns {object} - <table/> by it's #ID
  SortTable.prototype.init = function () {
    var self = this,
      tables = document.getElementsByTagName('table'),
      i,
      // Detects browsers and version
      // @see - http://stackoverflow.com/questions/2400935/browser-detection-in-javascript
      browser = function() {
        var N = navigator.appName,
          ua = navigator.userAgent,
          tem,
          M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);

        if (M && (tem = ua.match(/version\/([\.\d]+)/i)) !== null) {
          M[2] = tem[1];
        }

        M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];

        return M;
      };

    self.browsers = browser()[0];
    self.versions = browser()[1];

    self.handler = function (ev) {
      // get th to sort from current Event object
      var th = ev.target || ev.srcElement,
        tbody,
        el;

      if (th.getAttribute('data-sorttable') !== null) {
        tbody = self.get('tbody', th.parentElement.parentElement.parentElement);
        self.set(th, tbody);
      }
    };

    for (i = 0; i < tables.length; i += 1) {
      if (tables[i].getAttribute('data-sorttable')) {
        self.on('click', self.get('thead', tables[i]), self.handler);
      }
    }

    tables = null;
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

  // @param {string} el - table child element selectors ('tbody', 'thead', 'tfoot')
  SortTable.prototype.get = function (el, table) {
    if (el === 'tbody') {
      el = table.tBodies[0];

    // get tHead or tFoot
    } else if (el === 'thead' || el === 'tfoot') {
      el = table[el.replace(/(\w)(\w)/, function (wholeMatch, m1, m2) { return m1 + m2.toUpperCase(); })];
    }

    // clear variables that store dom objects reference
    try {
      return el;
    } finally {
      table = el = null;
    }
  };

  // @param {object} th - Native DOM th element
  // @param {object} tbody - Native DOM tbody element
  SortTable.prototype.set = function (th, tbody) {
    var i,
      cellIndex = th.cellIndex,
      rowsLength = tbody.rows.length,
      totalRows = rowsLength,
      row,
      value,
      cells = [],
      sortType = th.getAttribute('data-sorttable'),
      dataReverse = th.getAttribute('data-reverse'),
      reverse = this.browsers === 'MSIE' && this.versions === '7.0' ? dataReverse : dataReverse === 'true' ? true : false,
      newTr,
      temp;

    // console.time('set');

    for (i = 0; rowsLength > i; i += 1) {
      row = tbody.rows[i];

      // innerText doesn't work on Firefox it use textContent
      value = this.browsers === 'Firefox' ? row.cells[cellIndex].textContent : row.cells[cellIndex].innerText;

      cells.push({
        value: value,
        content: row.innerHTML
      });
    }

    // sort
    cells.sort(this.sortBy[sortType]);

    // reverse if needed
    if (reverse) {
      cells.reverse();
    }

    // toggle reverse status
    th.setAttribute('data-reverse', !reverse);

    for (i = 0; rowsLength > i; i += 1) {
      // innerHTML doesn't work on IE to empty the table, use deleteRow instead
      tbody.deleteRow(--totalRows);
      // create new div element
      // @see - http://www.ericvasilik.com/2006/07/code-karma.html
      temp = document.createElement('div');
      // insert a new table inside temp
      temp.innerHTML = '<table><tbody><tr>' + cells[i].content;
      // get the temp tbody element
      temp = this.get('tbody', temp.firstChild);
      // get the tbody rows
      newTr = temp.rows[0];
      // populate tbody with current tr
      tbody.appendChild(newTr);
    }

    // clear variables that store dom objects reference
    temp = tbody = th = row = newTr = null;

    // console.timeEnd('set');
  };

}());