(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .factory('mouseLocation', mouseLocation);

  function mouseLocation() {

    // x and y of mouse location
    var coordinates = null;
    var previousCoordinates = null;

    // reference to the connector that the mouse is currently over
    var connectorUnderMouse = null;
    // TODO same for node and edge if useful

    var api = {
      getCoordinates: function () {
        // return deep copy of the location so that we don't accidentally break encapsulation
        return angular.copy(coordinates);
      },
      setCoordinates: function (x,y) {
        if (coordinates) {
          previousCoordinates = coordinates;
        }
        coordinates = {
          x: x,
          y: y
        };
      },
      getConnectorUnderMouse: function () {
        return angular.copy(connectorUnderMouse);
      },
      setConnectorUnderMouse: function (connectorID, nodeID) {
        connectorUnderMouse = {
          connectorID: connectorID,
          nodeID: nodeID
        }
      }



    };
    return api;


  }
})();



