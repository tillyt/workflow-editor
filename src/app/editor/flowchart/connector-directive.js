(function() {

  'use strict';

  function connector() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        console.log(scope);
        element.attr('draggable', 'true');

        element.on('dragover', scope.callbacks.edgeDragoverConnector);
        element.on('drop', scope.callbacks.edgeDrop(scope.connector));
        element.on('dragend', scope.callbacks.edgeDragend);
        element.on('dragstart', scope.callbacks.edgeDragstart(scope.connector));
        element.on('mouseenter', scope.callbacks.connectorMouseEnter(scope.connector));
        element.on('mouseleave', scope.callbacks.connectorMouseLeave(scope.connector));

        element.addClass('workflow-connector');
        scope.$watch('mouseOverConnector', function(value) {
          if (value === scope.connector) {
            element.addClass('workflow-hover');
          } else {
            element.removeClass('workflow-hover');
          }
        });
        scope.modelservice.connectors.setHtmlElement(scope.connector.id, element[0]);
      }
    };
  }

  angular
    .module('workflowEditor')
    .directive('connector', connector);

}());
