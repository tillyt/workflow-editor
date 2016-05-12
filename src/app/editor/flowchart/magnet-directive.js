(function() {

  'use strict';

  function fcMagnet() {
    return {
      restrict: 'AE',
      link: function(scope, element) {
        element.addClass('workflow-magnet');

        element.on('dragover', scope.fcCallbacks.edgeDragoverMagnet(scope.connector));
        element.on('drop', scope.fcCallbacks.edgeDrop(scope.connector));
        element.on('dragend', scope.fcCallbacks.edgeDragend);
      }
    }
  }

  angular.module('workflowEditor')
    .directive('fcMagnet', fcMagnet);
}());
