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
          chart.dragPoint1 = chart.computeConnectorPos(node, connectorIndex, isInputConnector);
          chart.dragPoint2 = {
            x: curCoords.x,
            y: curCoords.y
          };
          chart.dragTangent1 = chart.computeConnectionSourceTangent(chart.dragPoint1, chart.dragPoint2);
          chart.dragTangent2 = chart.computeConnectionDestTangent(chart.dragPoint1, chart.dragPoint2);
        },

        //
        // Called on mousemove while dragging out a connection.
        //
        dragging: function (x, y, evt) {
          var startCoords = chart.translateCoordinates(x, y, evt);
          chart.dragPoint1 = chart.computeConnectorPos(node, connectorIndex, isInputConnector);
          chart.dragPoint2 = {
            x: startCoords.x,
            y: startCoords.y
          };
          chart.dragTangent1 = chart.computeConnectionSourceTangent(chart.dragPoint1, chart.dragPoint2);
          chart.dragTangent2 = chart.computeConnectionDestTangent(chart.dragPoint1, chart.dragPoint2);
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




    var chart = this;
    //
    // Width of a node.
    //
    chart.defaultNodeWidth = 250;

    //
    // Amount of space reserved for displaying the node's name.
    //
    chart.nodeNameHeight = 40;

    //
    // Height of a connector in a node.
    //
    chart.connectorHeight = 35;

    //
    // Compute the Y coordinate of a connector, given its index.
    //
    chart.computeConnectorY = function (connectorIndex) {
      return chart.nodeNameHeight + (connectorIndex * chart.connectorHeight);
    };

    //
    // Compute the position of a connector in the graph.
    //
    chart.computeConnectorPos = function (node, connectorIndex, inputConnector) {
      return {
        x: node.x() + (inputConnector ? 0 : node.width ? node.width() : chart.defaultNodeWidth),
        y: node.y() + chart.computeConnectorY(connectorIndex),
      };
    };

    //
    // View model for a connector.
    //
    chart.ConnectorViewModel = function (connectorDataModel, x, y, parentNode) {

      chart.data = connectorDataModel;
      chart._parentNode = parentNode;
      chart._x = x;
      chart._y = y;

      //
      // The name of the connector.
      //
      chart.name = function () {
        return chart.data.name;
      };

      //
      // X coordinate of the connector.
      //
      chart.x = function () {
        return chart._x;
      };

      //
      // Y coordinate of the connector.
      //
      chart.y = function () {
        return chart._y;
      };

      //
      // The parent node that the connector is attached to.
      //
      chart.parentNode = function () {
        return chart._parentNode;
      };
    };

    //
    // Create view model for a list of data models.
    //
    var createConnectorsViewModel = function (connectorDataModels, x, parentNode) {
      var viewModels = [];

      if (connectorDataModels) {
        for (var i = 0; i < connectorDataModels.length; ++i) {
          var connectorViewModel =
            new chart.ConnectorViewModel(connectorDataModels[i], x, chart.computeConnectorY(i), parentNode);
          viewModels.push(connectorViewModel);
        }
      }

      return viewModels;
    };

    //
    // View model for a node.
    //
    chart.NodeViewModel = function (nodeDataModel) {

      chart.data = nodeDataModel;

      // set the default width value of the node
      if (!chart.data.width || chart.data.width < 0) {
        chart.data.width = chart.defaultNodeWidth;
      }
      chart.inputConnectors = createConnectorsViewModel(chart.data.inputConnectors, 0, chart);
      chart.outputConnectors = createConnectorsViewModel(chart.data.outputConnectors, chart.data.width, chart);

      // Set to true when the node is selected.
      chart._selected = false;

      //
      // Name of the node.
      //
      chart.name = function () {
        return chart.data.name || "";
      };

      //
      // X coordinate of the node.
      //
      chart.x = function () {
        return chart.data.x;
      };

      //
      // Y coordinate of the node.
      //
      chart.y = function () {
        return chart.data.y;
      };

      //
      // Width of the node.
      //
      chart.width = function () {
        return chart.data.width;
      }

      //
      // Height of the node.
      //
      chart.height = function () {
        var numConnectors =
          Math.max(
            chart.inputConnectors.length,
            chart.outputConnectors.length);
        return chart.computeConnectorY(numConnectors);
      }

      //
      // Select the node.
      //
      chart.select = function () {
        chart._selected = true;
      };

      //
      // Deselect the node.
      //
      chart.deselect = function () {
        chart._selected = false;
      };

      //
      // Toggle the selection state of the node.
      //
      chart.toggleSelected = function () {
        chart._selected = !chart._selected;
      };

      //
      // Returns true if the node is selected.
      //
      chart.selected = function () {
        return chart._selected;
      };

      //
      // Internal function to add a connector.
      chart._addConnector = function (connectorDataModel, x, connectorsDataModel, connectorsViewModel) {
        var connectorViewModel =
          new chart.ConnectorViewModel(connectorDataModel, x,
            chart.computeConnectorY(connectorsViewModel.length), chart);

        connectorsDataModel.push(connectorDataModel);

        // Add to node's view model.
        connectorsViewModel.push(connectorViewModel);
      };

      //
      // Add an input connector to the node.
      //
      chart.addInputConnector = function (connectorDataModel) {

        if (!chart.data.inputConnectors) {
          chart.data.inputConnectors = [];
        }
        chart._addConnector(connectorDataModel, 0, chart.data.inputConnectors, chart.inputConnectors);
      };

      //
      // Add an ouput connector to the node.
      //
      chart.addOutputConnector = function (connectorDataModel) {

        if (!chart.data.outputConnectors) {
          chart.data.outputConnectors = [];
        }
        chart._addConnector(connectorDataModel, chart.data.width, chart.data.outputConnectors, chart.outputConnectors);
      };
    };

    //
    // Wrap the nodes data-model in a view-model.
    //
    var createNodesViewModel = function (nodesDataModel) {
      var nodesViewModel = [];

      if (nodesDataModel) {
        for (var i = 0; i < nodesDataModel.length; ++i) {
          nodesViewModel.push(new chart.NodeViewModel(nodesDataModel[i]));
        }
      }

      return nodesViewModel;
    };

    //
    // View model for a connection.
    //
    chart.ConnectionViewModel = function (connectionDataModel, sourceConnector, destConnector) {

      chart.data = connectionDataModel;
      chart.source = sourceConnector;
      chart.dest = destConnector;

      // Set to true when the connection is selected.
      chart._selected = false;

      chart.name = function () {
        return chart.data.name || "";
      };

      chart.sourceCoordX = function () {
        return chart.source.parentNode().x() + chart.source.x();
      };

      chart.sourceCoordY = function () {
        return chart.source.parentNode().y() + chart.source.y();
      };

      chart.sourceCoord = function () {
        return {
          x: chart.sourceCoordX(),
          y: chart.sourceCoordY()
        };
      };

      chart.sourceTangentX = function () {
        return chart.computeConnectionSourceTangentX(chart.sourceCoord(), chart.destCoord());
      };

      chart.sourceTangentY = function () {
        return chart.computeConnectionSourceTangentY(chart.sourceCoord(), chart.destCoord());
      };

      chart.destCoordX = function () {
        return chart.dest.parentNode().x() + chart.dest.x();
      };

      chart.destCoordY = function () {
        return chart.dest.parentNode().y() + chart.dest.y();
      };

      chart.destCoord = function () {
        return {
          x: chart.destCoordX(),
          y: chart.destCoordY()
        };
      };

      chart.destTangentX = function () {
        return chart.computeConnectionDestTangentX(chart.sourceCoord(), chart.destCoord());
      };

      chart.destTangentY = function () {
        return chart.computeConnectionDestTangentY(chart.sourceCoord(), chart.destCoord());
      };

      chart.middleX = function (scale) {
        if (typeof(scale) == "undefined")
          scale = 0.5;
        return chart.sourceCoordX() * (1 - scale) + chart.destCoordX() * scale;
      };

      chart.middleY = function (scale) {
        if (typeof(scale) == "undefined")
          scale = 0.5;
        return chart.sourceCoordY() * (1 - scale) + chart.destCoordY() * scale;
      };


      //
      // Select the connection.
      //
      chart.select = function () {
        chart._selected = true;
      };

      //
      // Deselect the connection.
      //
      chart.deselect = function () {
        chart._selected = false;
      };

      //
      // Toggle the selection state of the connection.
      //
      chart.toggleSelected = function () {
        chart._selected = !chart._selected;
      };

      //
      // Returns true if the connection is selected.
      //
      chart.selected = function () {
        return chart._selected;
      };
    };

    //
    // Helper function.
    //
    var computeConnectionTangentOffset = function (pt1, pt2) {

      return (pt2.x - pt1.x) / 2;
    }

    //
    // Compute the tangent for the bezier curve.
    //
    chart.computeConnectionSourceTangentX = function (pt1, pt2) {

      return pt1.x + computeConnectionTangentOffset(pt1, pt2);
    };

    //
    // Compute the tangent for the bezier curve.
    //
    chart.computeConnectionSourceTangentY = function (pt1, pt2) {

      return pt1.y;
    };

    //
    // Compute the tangent for the bezier curve.
    //
    chart.computeConnectionSourceTangent = function (pt1, pt2) {
      return {
        x: chart.computeConnectionSourceTangentX(pt1, pt2),
        y: chart.computeConnectionSourceTangentY(pt1, pt2),
      };
    };

    //
    // Compute the tangent for the bezier curve.
    //
    chart.computeConnectionDestTangentX = function (pt1, pt2) {

      return pt2.x - computeConnectionTangentOffset(pt1, pt2);
    };

    //
    // Compute the tangent for the bezier curve.
    //
    chart.computeConnectionDestTangentY = function (pt1, pt2) {

      return pt2.y;
    };

    //
    // Compute the tangent for the bezier curve.
    //
    chart.computeConnectionDestTangent = function (pt1, pt2) {
      return {
        x: chart.computeConnectionDestTangentX(pt1, pt2),
        y: chart.computeConnectionDestTangentY(pt1, pt2),
      };
    };

    //
    // View model for the chart.
    //
    chart.ChartViewModel = function (chartDataModel) {

      //
      // Find a specific node within the chart.
      //
      chart.findNode = function (nodeID) {

        for (var i = 0; i < chart.nodes.length; ++i) {
          var node = chart.nodes[i];
          if (node.data.id == nodeID) {
            return node;
          }
        }

        throw new Error("Failed to find node " + nodeID);
      };

      //
      // Find a specific input connector within the chart.
      //
      chart.findInputConnector = function (nodeID, connectorIndex) {

        var node = chart.findNode(nodeID);

        if (!node.inputConnectors || node.inputConnectors.length <= connectorIndex) {
          throw new Error("Node " + nodeID + " has invalid input connectors.");
        }

        return node.inputConnectors[connectorIndex];
      };

      //
      // Find a specific output connector within the chart.
      //
      chart.findOutputConnector = function (nodeID, connectorIndex) {

        var node = chart.findNode(nodeID);

        if (!node.outputConnectors || node.outputConnectors.length <= connectorIndex) {
          throw new Error("Node " + nodeID + " has invalid output connectors.");
        }

        return node.outputConnectors[connectorIndex];
      };

      //
      // Create a view model for connection from the data model.
      //
      chart._createConnectionViewModel = function (connectionDataModel) {

        var sourceConnector = chart.findOutputConnector(connectionDataModel.source.nodeID, connectionDataModel.source.connectorIndex);
        var destConnector = chart.findInputConnector(connectionDataModel.dest.nodeID, connectionDataModel.dest.connectorIndex);
        return new chart.ConnectionViewModel(connectionDataModel, sourceConnector, destConnector);
      };

      //
      // Wrap the connections data-model in a view-model.
      //
      chart._createConnectionsViewModel = function (connectionsDataModel) {

        var connectionsViewModel = [];

        if (connectionsDataModel) {
          for (var i = 0; i < connectionsDataModel.length; ++i) {
            connectionsViewModel.push(chart._createConnectionViewModel(connectionsDataModel[i]));
          }
        }

        return connectionsViewModel;
      };

      // Reference to the underlying data.
      chart.data = chartDataModel;

      // Create a view-model for nodes.
      chart.nodes = createNodesViewModel(chart.data.nodes);

      // Create a view-model for connections.
      chart.connections = chart._createConnectionsViewModel(chart.data.connections);

      //
      // Create a view model for a new connection.
      //
      chart.createNewConnection = function (startConnector, endConnector) {

        var connectionsDataModel = chart.data.connections;
        if (!connectionsDataModel) {
          connectionsDataModel = chart.data.connections = [];
        }

        var connectionsViewModel = chart.connections;
        if (!connectionsViewModel) {
          connectionsViewModel = chart.connections = [];
        }

        var startNode = startConnector.parentNode();
        var startConnectorIndex = startNode.outputConnectors.indexOf(startConnector);
        var startConnectorType = 'output';
        if (startConnectorIndex == -1) {
          startConnectorIndex = startNode.inputConnectors.indexOf(startConnector);
          startConnectorType = 'input';
          if (startConnectorIndex == -1) {
            throw new Error("Failed to find source connector within either inputConnectors or outputConnectors of source node.");
          }
        }

        var endNode = endConnector.parentNode();
        var endConnectorIndex = endNode.inputConnectors.indexOf(endConnector);
        var endConnectorType = 'input';
        if (endConnectorIndex == -1) {
          endConnectorIndex = endNode.outputConnectors.indexOf(endConnector);
          endConnectorType = 'output';
          if (endConnectorIndex == -1) {
            throw new Error("Failed to find dest connector within inputConnectors or outputConnectors of dest node.");
          }
        }

        if (startConnectorType == endConnectorType) {
          throw new Error("Failed to create connection. Only output to input connections are allowed.")
        }

        if (startNode == endNode) {
          throw new Error("Failed to create connection. Cannot link a node with itself.")
        }

        startNode = {
          nodeID: startNode.data.id,
          connectorIndex: startConnectorIndex
        };

        endNode = {
          nodeID: endNode.data.id,
          connectorIndex: endConnectorIndex
        };

        var connectionDataModel = {
          source: startConnectorType == 'output' ? startNode : endNode,
          dest: startConnectorType == 'output' ? endNode : startNode
        };
        connectionsDataModel.push(connectionDataModel);

        var outputConnector = startConnectorType == 'output' ? startConnector : endConnector;
        var inputConnector = startConnectorType == 'output' ? endConnector : startConnector;

        var connectionViewModel = new chart.ConnectionViewModel(connectionDataModel, outputConnector, inputConnector);
        connectionsViewModel.push(connectionViewModel);
      };

      //
      // Add a node to the view model.
      //
      chart.addNode = function (nodeDataModel) {
        if (!chart.data.nodes) {
          chart.data.nodes = [];
        }

        //
        // Update the data model.
        //
        chart.data.nodes.push(nodeDataModel);

        //
        // Update the view model.
        //
        chart.nodes.push(new chart.NodeViewModel(nodeDataModel));
      };

      //
      // Select all nodes and connections in the chart.
      //
      chart.selectAll = function () {

        var nodes = chart.nodes;
        for (var i = 0; i < nodes.length; ++i) {
          var node = nodes[i];
          node.select();
        }

        var connections = chart.connections;
        for (var j = 0; j < connections.length; ++j) {
          var connection = connections[j];
          connection.select();
        }
      };

      //
      // Deselect all nodes and connections in the chart.
      //
      chart.deselectAll = function () {

        var nodes = chart.nodes;
        for (var i = 0; i < nodes.length; ++i) {
          var node = nodes[i];
          node.deselect();
        }

        var connections = chart.connections;
        for (var i = 0; i < connections.length; ++i) {
          var connection = connections[i];
          connection.deselect();
        }
      };

      //
      // Update the location of the node and its connectors.
      //
      chart.updateSelectedNodesLocation = function (deltaX, deltaY) {

        var selectedNodes = chart.getSelectedNodes();

        for (var i = 0; i < selectedNodes.length; ++i) {
          var node = selectedNodes[i];
          node.data.x += deltaX;
          node.data.y += deltaY;
        }
      };

      //
      // Handle mouse click on a particular node.
      //
      chart.handleNodeClicked = function (node, ctrlKey) {

        if (ctrlKey) {
          node.toggleSelected();
        }
        else {
          chart.deselectAll();
          node.select();
        }

        // Move node to the end of the list so it is rendered after all the other.
        // model is the way Z-order is done in SVG.

        var nodeIndex = chart.nodes.indexOf(node);
        if (nodeIndex == -1) {
          throw new Error("Failed to find node in view model!");
        }
        chart.nodes.splice(nodeIndex, 1);
        chart.nodes.push(node);
      };

      //
      // Handle mouse down on a connection.
      //
      chart.handleConnectionMouseDown = function (connection, ctrlKey) {

        if (ctrlKey) {
          connection.toggleSelected();
        }
        else {
          chart.deselectAll();
          connection.select();
        }
      };

      //
      // Delete all nodes and connections that are selected.
      //
      chart.deleteSelected = function () {

        var newNodeViewModels = [];
        var newNodeDataModels = [];

        var deletedNodeIds = [];

        //
        // Sort nodes into:
        //		nodes to keep and
        //		nodes to delete.
        //

        for (var nodeIndex = 0; nodeIndex < chart.nodes.length; ++nodeIndex) {

          var node = chart.nodes[nodeIndex];
          if (!node.selected()) {
            // Only retain non-selected nodes.
            newNodeViewModels.push(node);
            newNodeDataModels.push(node.data);
          }
          else {
            // Keep track of nodes that were deleted, so their connections can also
            // be deleted.
            deletedNodeIds.push(node.data.id);
          }
        }

        var newConnectionViewModels = [];
        var newConnectionDataModels = [];

        //
        // Remove connections that are selected.
        // Also remove connections for nodes that have been deleted.
        //
        for (var connectionIndex = 0; connectionIndex < chart.connections.length; ++connectionIndex) {

          var connection = chart.connections[connectionIndex];
          if (!connection.selected() &&
            deletedNodeIds.indexOf(connection.data.source.nodeID) === -1 &&
            deletedNodeIds.indexOf(connection.data.dest.nodeID) === -1) {
            //
            // The nodes model connection is attached to, where not deleted,
            // so keep the connection.
            //
            newConnectionViewModels.push(connection);
            newConnectionDataModels.push(connection.data);
          }
        }

        //
        // Update nodes and connections.
        //
        chart.nodes = newNodeViewModels;
        chart.data.nodes = newNodeDataModels;
        chart.connections = newConnectionViewModels;
        chart.data.connections = newConnectionDataModels;
      };

      //
      // Select nodes and connections that fall within the selection rect.
      //
      chart.applySelectionRect = function (selectionRect) {

        chart.deselectAll();

        for (var i = 0; i < chart.nodes.length; ++i) {
          var node = chart.nodes[i];
          if (node.x() >= selectionRect.x &&
            node.y() >= selectionRect.y &&
            node.x() + node.width() <= selectionRect.x + selectionRect.width &&
            node.y() + node.height() <= selectionRect.y + selectionRect.height) {
            // Select nodes that are within the selection rect.
            node.select();
          }
        }

        for (var i = 0; i < chart.connections.length; ++i) {
          var connection = chart.connections[i];
          if (connection.source.parentNode().selected() &&
            connection.dest.parentNode().selected()) {
            // Select the connection if both its parent nodes are selected.
            connection.select();
          }
        }

      };

      //
      // Get the array of nodes that are currently selected.
      //
      chart.getSelectedNodes = function () {
        var selectedNodes = [];

        for (var i = 0; i < chart.nodes.length; ++i) {
          var node = chart.nodes[i];
          if (node.selected()) {
            selectedNodes.push(node);
          }
        }

        return selectedNodes;
      };

      //
      // Get the array of connections that are currently selected.
      //
      chart.getSelectedConnections = function () {
        var selectedConnections = [];

        for (var i = 0; i < chart.connections.length; ++i) {
          var connection = chart.connections[i];
          if (connection.selected()) {
            selectedConnections.push(connection);
          }
        }

        return selectedConnections;
      };

    }
    
    

  }
})();
