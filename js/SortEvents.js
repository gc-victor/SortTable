(function () {
  SortEvents = function () {};

  SortEvents.prototype.bindEvent = function (el, eventName, eventHandler) {
    if (el.addEventListener) {
      el.addEventListener(eventName, eventHandler, false);
    } else if (el.attachEvent) {
      el.attachEvent('on' + eventName, eventHandler);
    }
  };
}());

var SortEvents = new SortEvents();