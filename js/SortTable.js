// SortTable.js
// @version 0.1

var SortTable;

!function () {

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
      i;

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

  SortTable.prototype.addClass = function (el, classes) {
    var className = el !== undefined ? el.className : '';
    if (className !== '') {
      el.className = className.indexOf(classes) === -1 ? classes + ' ' + className : className;
    }
  };

  SortTable.prototype.removeClass = function (el, classes) {
    var className = el !== undefined ? el.className : '';
    if (className !== '') {
      // Remove the class and any value space at the start or end
      el.className = el.className.indexOf(classes) === 0 ? className.replace(classes, '').replace(/^\s+|\s+$/g, '') : className;
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
    el = el === 'tbody' ? table.tBodies[0] : el === 'thead' ? table.tHead : el === 'tfoot' ? table.tFoot : null;

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
      get = th.getAttribute('data-reverse'),
      reverse = get === null ? false : get.toString() === 'true' ? true : false,
      selected = th.parentElement.getElementsByTagName('th'),
      el,
      is = 'is-selected',
      newTr,
      temp;

    // Remove the class '.is-selected' from <thead/> childs.
    for (i = 0; i < selected.length; i += 1) {
      el = selected[i];
      // Like a "getElementsByClassName"
      if (el.className && el.className.indexOf(is) === 0) {
        this.removeClass(el, is);
      }
    }

    // addClass '.is-selected' to the <th/> selected
    this.addClass(th, is);

    for (i = 0; rowsLength > i; i += 1) {
      row = tbody.rows[i];
      // innerText doesn't work on Firefox it use textContent
      value = row.cells[cellIndex].textContent || row.cells[cellIndex].innerText;
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
    temp = tbody = th = row = selected = newTr = null;
  };

}();