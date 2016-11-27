/**
 * Created by YY on 2016/11/26.
 */
(function () {
  angular.module('layout.header')
    .factory('headerFactory', factory);
  function factory() {
    var self = {};
    self.setTitle = function (t) {
      self.title = t;
    };
    return self;
  }
})();