(function() {

  'use strict';

  function fcConnector() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.attr('draggable', 'true');

        element.on('dragover', scope.fcCallbacks.edgeDragoverConnector);
        element.on('drop', scope.fcCallbacks.edgeDrop(scope.connector));
        element.on('dragend', scope.fcCallbacks.edgeDragend);
        element.on('dragstart', scope.fcCallbacks.edgeDragstart(scope.connector));
        element.on('mouseenter', scope.fcCallbacks.connectorMouseEnter(scope.connector));
        element.on('mouseleave', scope.fcCallbacks.connectorMouseLeave(scope.connector));

        element.addClass('workflow-connector');
        scope.$watch('mouseOverConnector', function(value) {
          if (value === scope.connector) {
            element.addClass('workflow-hover');
          } else {
            element.removeClass('workflow-hover');
          }
        });
//TODO fix me to set element to connector's ID
        scope.modelservice.connectors.setHtmlElement(scope.connector, element[0]);
      }
    };
  }

  angular
    .module('workflowEditor')
    .directive('fcConnector', fcConnector);

}());
