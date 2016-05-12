(function() {

  'use strict';

  function fcCanvas() {
    return {
      restrict: 'E',
      templateUrl: "/app/editor/flowchart/canvas.html",
      replace: true,
      scope: {
        model: "=",
        selectedObjects: "=",
        edgeStyle: '@',
        userCallbacks: '=?callbacks',
        automaticResize: '=?',
        nodeWidth: '=?',
        nodeHeight: '=?'
      },
      controller: 'canvasController',
      link: function(scope, element) {
        function adjustCanvasSize() {
          if (scope.model) {
            var maxX = 0;
            var maxY = 0;
            angular.forEach(scope.model.nodes, function (node, key) {
              maxX = Math.max(node.x + scope.nodeWidth, maxX);
              maxY = Math.max(node.y + scope.nodeHeight, maxY);
            });
            element.css('width', Math.max(maxX, element.prop('offsetWidth')) + 'px');
            element.css('height', Math.max(maxY, element.prop('offsetHeight')) + 'px');
          }
        }
        if (scope.edgeStyle !== 'curved' && scope.edgeStyle !== 'line') {
          throw new Error('edgeStyle not supported.');
        }
        scope.nodeHeight = scope.nodeHeight || 200;
        scope.nodeWidth = scope.nodeWidth || 200;

        element.addClass('workflow-canvas');
        element.on('dragover', scope.dragover);
        element.on('drop', scope.drop);

        scope.$watch('model', adjustCanvasSize);

        scope.modelservice.setCanvasHtmlElement(element[0]);
      }
    };
  }

  angular
    .module('workflowEditor')
    .directive('fcCanvas', fcCanvas);

}());

