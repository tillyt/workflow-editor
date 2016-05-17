(function() {

  'use strict';

  function node() {
    return {
      restrict: 'E',
      templateUrl: '/app/editor/node.html',
      replace: true,
      scope: {
        callbacks: '=callbacks',
        nodeCallbacks: '=userNodeCallbacks',
        node: '=',
        selected: '=',
        underMouse: '=',
        mouseOverConnector: '=',
        modelservice: '=',
        draggedNode: '='
      },
      link: function(scope, element) {
        element.attr('draggable', 'true');

        element.on('dragstart', scope.callbacks.nodeDragstart(scope.node));
        element.on('dragend', scope.callbacks.nodeDragend);
        element.on('click', scope.callbacks.nodeClicked(scope.node));
        element.on('mouseover', scope.callbacks.nodeMouseOver(scope.node));
        element.on('mouseout', scope.callbacks.nodeMouseOut(scope.node));

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

  angular.module('workflowEditor').directive('node', node);
}());
