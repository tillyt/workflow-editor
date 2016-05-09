(function () {
  'use strict'

  angular
    .module('workflowEditor')
    .factory('dragging', dragging);

  function dragging(mouseLocation) {

    // dragging starts when mouse moves at least this many pixels
    var threshold = 5;

    var api = {

      startDrag: function (evt, config) {
        // called by users of the service after mousedown to start dragging
        var dragging = false;
        var x = evt.pageX;
        var y = evt.pageY;

        // Handler for mousemove events while the mouse is 'captured'.
        var mouseMove = function (evt) {

          if (!dragging) {
            if (Math.abs(evt.pageX - x) > threshold ||
              Math.abs(evt.pageY - y) > threshold) {
              dragging = true;

              if (config.dragStarted) {
                config.dragStarted(x, y, evt);
              }

              if (config.dragging) {
                // First 'dragging' call to take into account that we have
                // already moved the mouse by a 'threshold' amount.
                config.dragging(evt.pageX, evt.pageY, evt);
              }
            }
          }
          else {
            if (config.dragging) {
              config.dragging(evt.pageX, evt.pageY, evt);
            }

            x = evt.pageX;
            y = evt.pageY;
          }
        };

        // Handler for when mouse capture is released.
        var released = function () {

          if (dragging) {
            if (config.dragEnded) {
              config.dragEnded();
            }
          }
          else {
            if (config.clicked) {
              config.clicked();
            }
          }
        };

        // Handler for mouseup event while the mouse is 'captured'.
        // Mouseup releases the mouse capture.
        var mouseUp = function (evt) {

          mouseLocation.release();

          evt.stopPropagation();
          evt.preventDefault();
        };

        // Acquire the mouse capture and start handling mouse events.
        mouseLocation.acquire(evt, {
          mouseMove: mouseMove,
          mouseUp: mouseUp,
          released: released
        });

        evt.stopPropagation();
        evt.preventDefault();
      }

    };

    return api;

  }

})();
