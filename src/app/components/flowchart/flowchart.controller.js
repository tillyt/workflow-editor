(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .controller('FlowchartController', FlowchartController);

  function FlowchartController(dragging, $element, model) {

    var chart = this;


// jQuery's hasClass doesn't work for SVG, but this does!
// takes an object obj and checks for class has
// returns true if the class exits in obj, false otherwise
    var hasClassSVG = function(obj, has) {
      var classes = obj.attr('class');
      if (!classes) {
        return false;
      }

      var index = classes.search(has);

      if (index == -1) {
        return false;
      }
      else {
        return true;
      }
    };




    //
    // Init data-model variables.
    //
    chart.draggingConnection = false;
    chart.connectorSize = 10;
    chart.dragSelecting = false;
    /* Can use chart to test the drag selection rect.
     chart.dragSelectionRect = {
     x: 0,
     y: 0,
     width: 0,
     height: 0,
     };
     */

    //
    // Reference to the connection, connector or node that the mouse is currently over.
    //
    chart.mouseOverConnector = null;
    chart.mouseOverConnection = null;
    chart.mouseOverNode = null;

    //
    // The class for connections and connectors.
    //
    chart.connectionClass = 'connection';
    chart.connectorClass = 'connector';
    chart.nodeClass = 'node';

    //
    // Search up the HTML element tree for an element the requested class.
    //
    chart.searchUp = function (element, parentClass) {

      //
      // Reached the root.
      //
      if (element == null || element.length == 0) {
        return null;
      }

      //
      // Check if the element has the class that identifies it as a connector.
      //
      if (hasClassSVG(element, parentClass)) {
        //
        // Found the connector element.
        //
        return element;
      }

      //
      // Recursively search parent elements.
      //
      return chart.searchUp(element.parent(), parentClass);
    };

    //
    // Hit test and retreive node and connector that was hit at the specified coordinates.
    //
    chart.hitTest = function (clientX, clientY) {

      //
      // Retreive the element the mouse is currently over.
      //
      return chart.document.elementFromPoint(clientX, clientY);
    };

    //
    // Hit test and retreive node and connector that was hit at the specified coordinates.
    //
    chart.checkForHit = function (mouseOverElement, whichClass) {

      //
      // Find the parent element, if any, that is a connector.
      //
      var hoverElement = chart.searchUp(angular.element(mouseOverElement), whichClass);
      if (!hoverElement) {
        return null;
      }

      return hoverElement.scope();
    };

    //
    // Translate the coordinates so they are relative to the svg element.
    //
    chart.translateCoordinates = function (x, y, evt) {
      console.log($element)
      var svg_elem = $element.get(0);
      var matrix = svg_elem.getScreenCTM();
      var point = svg_elem.createSVGPoint();
      point.x = x - evt.view.pageXOffset;
      point.y = y - evt.view.pageYOffset;
      return point.matrixTransform(matrix.inverse());
    };

    //
    // Called on mouse down in the chart.
    //
    chart.mouseDown = function (evt) {

      chart.chart.deselectAll();

      dragging.startDrag(evt, {

        //
        // Commence dragging... setup variables to display the drag selection rect.
        //
        dragStarted: function (x, y) {
          chart.dragSelecting = true;
          var startPoint = chart.translateCoordinates(x, y, evt);
          chart.dragSelectionStartPoint = startPoint;
          chart.dragSelectionRect = {
            x: startPoint.x,
            y: startPoint.y,
            width: 0,
            height: 0,
          };
        },

        //
        // Update the drag selection rect while dragging continues.
        //
        dragging: function (x, y) {
          var startPoint = chart.dragSelectionStartPoint;
          var curPoint = chart.translateCoordinates(x, y, evt);

          chart.dragSelectionRect = {
            x: curPoint.x > startPoint.x ? startPoint.x : curPoint.x,
            y: curPoint.y > startPoint.y ? startPoint.y : curPoint.y,
            width: curPoint.x > startPoint.x ? curPoint.x - startPoint.x : startPoint.x - curPoint.x,
            height: curPoint.y > startPoint.y ? curPoint.y - startPoint.y : startPoint.y - curPoint.y,
          };
        },

        //
        // Dragging has ended... select all that are within the drag selection rect.
        //
        dragEnded: function () {
          chart.dragSelecting = false;
          chart.chart.applySelectionRect(chart.dragSelectionRect);
          delete chart.dragSelectionStartPoint;
          delete chart.dragSelectionRect;
        },
      });
    };

    //
    // Called for each mouse move on the svg element.
    //
    chart.mouseMove = function (evt) {

      //
      // Clear out all cached mouse over elements.
      //
      chart.mouseOverConnection = null;
      chart.mouseOverConnector = null;
      chart.mouseOverNode = null;

      var mouseOverElement = chart.hitTest(evt.clientX, evt.clientY);
      if (mouseOverElement == null) {
        // Mouse isn't over anything, just clear all.
        return;
      }

      if (!chart.draggingConnection) { // Only allow 'connection mouse over' when not dragging out a connection.

        // Figure out if the mouse is over a connection.
        var scope = chart.checkForHit(mouseOverElement, chart.connectionClass);
        chart.mouseOverConnection = (scope && scope.connection) ? scope.connection : null;
        if (chart.mouseOverConnection) {
          // Don't attempt to mouse over anything else.
          return;
        }
      }

      // Figure out if the mouse is over a connector.
      var scope = chart.checkForHit(mouseOverElement, chart.connectorClass);
      chart.mouseOverConnector = (scope && scope.connector) ? scope.connector : null;
      if (chart.mouseOverConnector) {
        // Don't attempt to mouse over anything else.
        return;
      }

      // Figure out if the mouse is over a node.
      var scope = chart.checkForHit(mouseOverElement, chart.nodeClass);
      chart.mouseOverNode = (scope && scope.node) ? scope.node : null;
    };

    //
    // Handle mousedown on a node.
    //
    chart.nodeMouseDown = function (evt, node) {

      var chart = chart.chart;
      var lastMouseCoords;

      dragging.startDrag(evt, {

        //
        // Node dragging has commenced.
        //
        dragStarted: function (x, y) {

          lastMouseCoords = chart.translateCoordinates(x, y, evt);

          //
          // If nothing is selected when dragging starts,
          // at least select the node we are dragging.
          //
          if (!node.selected()) {
            chart.deselectAll();
            node.select();
          }
        },

        //
        // Dragging selected nodes... update their x,y coordinates.
        //
        dragging: function (x, y) {

          var curCoords = chart.translateCoordinates(x, y, evt);
          var deltaX = curCoords.x - lastMouseCoords.x;
          var deltaY = curCoords.y - lastMouseCoords.y;

          chart.updateSelectedNodesLocation(deltaX, deltaY);

          lastMouseCoords = curCoords;
        },

        //
        // The node wasn't dragged... it was clicked.
        //
        clicked: function () {
          chart.handleNodeClicked(node, evt.ctrlKey);
        },

      });
    };

    //
    // Handle mousedown on a connection.
    //
    chart.connectionMouseDown = function (evt, connection) {
      var chart = chart.chart;
      chart.handleConnectionMouseDown(connection, evt.ctrlKey);

      // Don't let the chart handle the mouse down.
      evt.stopPropagation();
      evt.preventDefault();
    };

    //
    // Handle mousedown on an input connector.
    //
    chart.connectorMouseDown = function (evt, node, connector, connectorIndex, isInputConnector) {

      //
      // Initiate dragging out of a connection.
      //
      dragging.startDrag(evt, {

        //
        // Called when the mouse has moved greater than the threshold distance
        // and dragging has commenced.
        //
        dragStarted: function (x, y) {

          var curCoords = chart.translateCoordinates(x, y, evt);

          chart.draggingConnection = true;
          chart.dragPoint1 = model.computeConnectorPos(node, connectorIndex, isInputConnector);
          chart.dragPoint2 = {
            x: curCoords.x,
            y: curCoords.y
          };
          chart.dragTangent1 = model.computeConnectionSourceTangent(chart.dragPoint1, chart.dragPoint2);
          chart.dragTangent2 = model.computeConnectionDestTangent(chart.dragPoint1, chart.dragPoint2);
        },

        //
        // Called on mousemove while dragging out a connection.
        //
        dragging: function (x, y, evt) {
          var startCoords = chart.translateCoordinates(x, y, evt);
          chart.dragPoint1 = model.computeConnectorPos(node, connectorIndex, isInputConnector);
          chart.dragPoint2 = {
            x: startCoords.x,
            y: startCoords.y
          };
          chart.dragTangent1 = model.computeConnectionSourceTangent(chart.dragPoint1, chart.dragPoint2);
          chart.dragTangent2 = model.computeConnectionDestTangent(chart.dragPoint1, chart.dragPoint2);
        },

        //
        // Clean up when dragging has finished.
        //
        dragEnded: function () {

          if (chart.mouseOverConnector &&
            chart.mouseOverConnector !== connector) {

            //
            // Dragging has ended...
            // The mouse is over a valid connector...
            // Create a new connection.
            //
            chart.chart.createNewConnection(connector, chart.mouseOverConnector);
          }

          chart.draggingConnection = false;
          delete chart.dragPoint1;
          delete chart.dragTangent1;
          delete chart.dragPoint2;
          delete chart.dragTangent2;
        }

      });
    };

  }
})();
