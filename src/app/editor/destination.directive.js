(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .directive('destination', destination);

  /** @ngInject */
  function destination() {
    return {
      restrict: 'A',
      scope: {
        magnet: '=destination'
      },
      link: function (scope, elem, attrs) {
        var startX, startY, x = 0, y = 0;
        var magnet = scope.magnet;

        // Bind mousedown event
        elem.on('mousedown', function (e) {
          e.preventDefault();
          e.stopPropagation();
          startX = e.clientX - x;
          startY = e.clientY - y;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        // Handle drag event
        function mousemove(e) {
          e.stopPropagation();
          y = e.clientY - startY;
          x = e.clientX - startX;
          setPosition();
        }

        // Unbind drag events
        function mouseup(e) {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }

        // Move element, within container if provided
        function setPosition() {



          
        }
      }




    }
  }

})();











