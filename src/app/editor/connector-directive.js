(function() {

  'use strict';

  function nodeConnector() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var connector = scope.output || scope.input;
        var id = connector.id;
        element.attr('draggable', 'true');

        element.on('dragover', scope.callbacks.edgeDragoverConnector);
        element.on('drop', scope.callbacks.edgeDrop(connector));
        element.on('dragend', scope.callbacks.edgeDragend);
        element.on('dragstart', scope.callbacks.edgeDragstart(connector));
        console.log(connector);
        element.on('mouseenter', scope.callbacks.connectorMouseEnter(connector));
        element.on('mouseleave', scope.callbacks.connectorMouseLeave(connector));

        element.addClass('workflow-connector');
        scope.$watch('mouseOverConnector', function(value) {
          if (value === scope.connector) {
            element.addClass('workflow-hover');
          } else {
            element.removeClass('workflow-hover');
          }
        });
        scope.modelservice.connectors.setHtmlElement(id, element[0]);
      }
    };
  }

  angular
    .module('workflowEditor')
    .directive('nodeConnector',nodeConnector);

}());
