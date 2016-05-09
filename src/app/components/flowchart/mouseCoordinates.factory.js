(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .factory('mouseCoordinates', mouseCoordinates);

  function mouseCoordinates() {

    var location = null;
    var previousLocation = null;

    var api = {
      getLocation: function () {
        // return deep copy of the location so that we don't accidentally break encapsulation
        return angular.copy(location);
      },
      setLocation: function (x,y) {
        if (location) {
          previousLocation = location;
        }
        location = {
          x: x,
          y: y
        };
      }
    };
    return api;


  }
})();



