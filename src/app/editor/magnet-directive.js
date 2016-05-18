(function() {

  'use strict';

  function magnet() {
    return {
      restrict: 'AE',
      link: function(scope, element) {
        element.addClass('workflow-magnet');

        element.on('dragover', scope.callbacks.edgeDragoverMagnet(scope.connector));
        element.on('drop', scope.callbacks.edgeDrop(scope.connector));
        element.on('dragend', scope.callbacks.edgeDragend);
      }
    }
  }

  angular.module('workflowEditor')
    .directive('magnet', magnet);
}());
