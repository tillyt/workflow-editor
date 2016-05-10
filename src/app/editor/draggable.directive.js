(function () {
    'use strict';

    angular
      .module('workflowEditor')
      .directive('draggable', draggable);

    function draggable($document) {
      return {
        restrict: 'A',
        scope: {
          container: '=draggable'
        },
        link: function (scope, elem, attr) {
          var startX, startY, x = 0, y = 0;
          var container = scope.container;

          // Bind mousedown event
          elem.on('mousedown', function (e) {
            e.preventDefault();
            startX = e.clientX - x;
            startY = e.clientY - y;
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
          });

          // Handle drag event
          function mousemove(e) {
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
            if (container) {
              if (x < 0) {
                x = 0;
              } else if (x > container.right) {
                x = container.right;
              }
              if (y < 0) {
                y = 0;
              } else if (y > container.bottom) {
                y = container.bottom;
              }
            }
            elem.css({
              transform: 'translate(' + x + 'px,' + y + 'px)'
            });
            attr.x = x;
            attr.y = y;
            // scope.$apply(function(){
            //   scope.$eval(attr.x + '=' + x);
            //   scope.$eval(attr.y + '=' + y);
            // });
          }
        }

      }

    }
  }
)();





//
// link: function (scope, elem, attr) {
//    (elem);
//   var startX, startY, x = 0, y = 0;
//   var container;
//   var startCallback, dragCallback, stopCallback;
//   if (scope.dragOptions) {
//     container = scope.dragOptions.container;
//     startCallback = scope.dragOptions.startCallback;
//     dragCallback = scope.dragOptions.dragCallback;
//     stopCallback = scope.dragOptions.stopCallback;
//   }
//
//    (elem.children()[0]);
//
//   // Bind mousedown event
//   elem.on('mousedown', function (e) {
//     e.preventDefault();
//     startX = e.clientX - x;
//     startY = e.clientY - y;
//     $document.on('mousemove', mousemove);
//     $document.on('mouseup', mouseup);
//     if (startCallback) startCallback(e);
//   });
//
//   // Handle drag event
//   function mousemove(e) {
//     y = e.clientY - startY;
//     x = e.clientX - startX;
//     setPosition();
//     if (dragCallback) dragCallback(e);
//   }
//
//   // Unbind drag events
//   function mouseup(e) {
//     $document.unbind('mousemove', mousemove);
//     $document.unbind('mouseup', mouseup);
//     if (stopCallback) stopCallback(e);
//   }
//
//   // Move element, within container if provided
//   function setPosition() {
//     if (container) {
//       if (x < container.left) {
//         x = container.left;
//       } else if (x > container.right) {
//         x = container.right;
//       }
//       if (y < container.top) {
//         y = container.top;
//       } else if (y > container.bottom) {
//         y = container.bottom;
//       }
//     }
//     mainCtrl.changeNodePosition(attr.id, x, y);
//     elem.css({
//       transform: 'translate(' + x + 'px,' + y + 'px)',
//     });
//     attr.x = x;
//     attr.y = y;
//     // scope.$apply(function(){
//     //   scope.$eval(attr.x + '=' + x);
//     //   scope.$eval(attr.y + '=' + y);
//     // });
//   }

