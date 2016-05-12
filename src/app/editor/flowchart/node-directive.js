(function() {

  'use strict';

  function fcNode() {
    return {
      restrict: 'E',
      templateUrl: '/app/editor/flowchart/node.html',
      replace: false,
      scope: {
        fcCallbacks: '=callbacks',
        callbacks: '=userNodeCallbacks',
        node: '=',
        selected: '=',
        underMouse: '=',
        mouseOverConnector: '=',
        modelservice: '=',
        draggedNode: '='
      },
      link: function(scope, element) {
        element.attr('draggable', 'true');

        element.on('dragstart', scope.fcCallbacks.nodeDragstart(scope.node));
        element.on('dragend', scope.fcCallbacks.nodeDragend);
        element.on('click', scope.fcCallbacks.nodeClicked(scope.node));
        element.on('mouseover', scope.fcCallbacks.nodeMouseOver(scope.node));
        element.on('mouseout', scope.fcCallbacks.nodeMouseOut(scope.node));

        element.addClass('workflow-node');

        function myToggleClass(clazz, set) {
          if (set) {
            element.addClass(clazz);
          } else {
            element.removeClass(clazz);
          }
        }

        scope.$watch('selected', function(value) {
          myToggleClass('workflow-selected', value);
        });
        scope.$watch('underMouse', function(value) {
          myToggleClass('workflow-hover', value);
        });
        scope.$watch('draggedNode', function(value) {
          myToggleClass('workflow-dragging', value===scope.node);
        });
      }
    };
  }

  angular.module('workflowEditor').directive('fcNode', fcNode);
}());
