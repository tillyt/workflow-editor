(function() {

  'use strict';

  function workflowCanvas() {
    return {
      restrict: 'E',
      templateUrl: "/app/editor/flowchart/canvas.html",
      replace: true,
      scope: {
        model: "=",
        selectedObjects: "=",
        edgeStyle: '@',
        nodeCallbacks: '=?callbacks',
        automaticResize: '=?',
        nodeWidth: '=?',
        nodeHeight: '=?'
      },
      controller: 'canvasController',
      controllerAs: 'vm',
      bindToController: true,
      link: function(scope, element) {
        function adjustCanvasSize() {
          if (scope.vm.model) {
            var maxX = 0;
            var maxY = 0;
            angular.forEach(scope.vm.model.nodes, function (node, key) {
              maxX = Math.max(node.x + scope.vm.nodeWidth, maxX);
              maxY = Math.max(node.y + scope.vm.nodeHeight, maxY);
            });
            element.css('width', Math.max(maxX, element.prop('offsetWidth')) + 'px');
            element.css('height', Math.max(maxY, element.prop('offsetHeight')) + 'px');
          }
        }
        if (scope.vm.edgeStyle !== 'curve' && scope.vm.edgeStyle !== 'line') {
          throw new Error('edgeStyle not supported.');
        }
        scope.vm.nodeHeight = scope.vm.nodeHeight || 200;
        scope.vm.nodeWidth = scope.vm.nodeWidth || 200;

        element.addClass('workflow-canvas');
        element.on('dragover', scope.vm.dragover);
        element.on('drop', scope.vm.drop);

        scope.$watch('model', adjustCanvasSize);

        scope.vm.modelservice.setCanvasHtmlElement(element[0]);
      }
    };
  }

  angular
    .module('workflowEditor')
    .directive('workflowCanvas', workflowCanvas);

}());

