(function () {
  // Ways to sort.
  // @constructor
  // @param {string} str - SortBy name
  // @example var SortBy = new SortBy('date');
  // @returns {string}
  SortBy = function () {};

  SortBy.prototype.sortObject = function (a,b) {
    var value = 'value';
    return a[value] < b[value] ? -1 : a[value] > b[value] ? 1 : 0;
  };
}());

var SortBy = new SortBy();