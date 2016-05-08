(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .service('model', model);

  /** @ngInject */
  function model() {

    var model = this;
    //
    // Width of a node.
    //
    model.defaultNodeWidth = 250;

    //
    // Amount of space reserved for displaying the node's name.
    //
    model.nodeNameHeight = 40;

    //
    // Height of a connector in a node.
    //
    model.connectorHeight = 35;

    //
    // Compute the Y coordinate of a connector, given its index.
    //
    model.computeConnectorY = function (connectorIndex) {
      return model.nodeNameHeight + (connectorIndex * model.connectorHeight);
    };

    //
    // Compute the position of a connector in the graph.
    //
    model.computeConnectorPos = function (node, connectorIndex, inputConnector) {
      return {
        x: node.x() + (inputConnector ? 0 : node.width ? node.width() : model.defaultNodeWidth),
        y: node.y() + model.computeConnectorY(connectorIndex),
      };
    };

    //
    // View model for a connector.
    //
    model.ConnectorViewModel = function (connectorDataModel, x, y, parentNode) {

      model.data = connectorDataModel;
      model._parentNode = parentNode;
      model._x = x;
      model._y = y;

      //
      // The name of the connector.
      //
      model.name = function () {
        return model.data.name;
      };

      //
      // X coordinate of the connector.
      //
      model.x = function () {
        return model._x;
      };

      //
      // Y coordinate of the connector.
      //
      model.y = function () {
        return model._y;
      };

      //
      // The parent node that the connector is attached to.
      //
      model.parentNode = function () {
        return model._parentNode;
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
            new model.ConnectorViewModel(connectorDataModels[i], x, model.computeConnectorY(i), parentNode);
          viewModels.push(connectorViewModel);
        }
      }

      return viewModels;
    };

    //
    // View model for a node.
    //
    model.NodeViewModel = function (nodeDataModel) {

      model.data = nodeDataModel;

      // set the default width value of the node
      if (!model.data.width || model.data.width < 0) {
        model.data.width = model.defaultNodeWidth;
      }
      model.inputConnectors = createConnectorsViewModel(model.data.inputConnectors, 0, model);
      model.outputConnectors = createConnectorsViewModel(model.data.outputConnectors, model.data.width, model);

      // Set to true when the node is selected.
      model._selected = false;

      //
      // Name of the node.
      //
      model.name = function () {
        return model.data.name || "";
      };

      //
      // X coordinate of the node.
      //
      model.x = function () {
        return model.data.x;
      };

      //
      // Y coordinate of the node.
      //
      model.y = function () {
        return model.data.y;
      };

      //
      // Width of the node.
      //
      model.width = function () {
        return model.data.width;
      }

      //
      // Height of the node.
      //
      model.height = function () {
        var numConnectors =
          Math.max(
            model.inputConnectors.length,
            model.outputConnectors.length);
        return model.computeConnectorY(numConnectors);
      }

      //
      // Select the node.
      //
      model.select = function () {
        model._selected = true;
      };

      //
      // Deselect the node.
      //
      model.deselect = function () {
        model._selected = false;
      };

      //
      // Toggle the selection state of the node.
      //
      model.toggleSelected = function () {
        model._selected = !model._selected;
      };

      //
      // Returns true if the node is selected.
      //
      model.selected = function () {
        return model._selected;
      };

      //
      // Internal function to add a connector.
      model._addConnector = function (connectorDataModel, x, connectorsDataModel, connectorsViewModel) {
        var connectorViewModel =
          new model.ConnectorViewModel(connectorDataModel, x,
            model.computeConnectorY(connectorsViewModel.length), model);

        connectorsDataModel.push(connectorDataModel);

        // Add to node's view model.
        connectorsViewModel.push(connectorViewModel);
      };

      //
      // Add an input connector to the node.
      //
      model.addInputConnector = function (connectorDataModel) {

        if (!model.data.inputConnectors) {
          model.data.inputConnectors = [];
        }
        model._addConnector(connectorDataModel, 0, model.data.inputConnectors, model.inputConnectors);
      };

      //
      // Add an ouput connector to the node.
      //
      model.addOutputConnector = function (connectorDataModel) {

        if (!model.data.outputConnectors) {
          model.data.outputConnectors = [];
        }
        model._addConnector(connectorDataModel, model.data.width, model.data.outputConnectors, model.outputConnectors);
      };
    };

    //
    // Wrap the nodes data-model in a view-model.
    //
    var createNodesViewModel = function (nodesDataModel) {
      var nodesViewModel = [];

      if (nodesDataModel) {
        for (var i = 0; i < nodesDataModel.length; ++i) {
          nodesViewModel.push(new model.NodeViewModel(nodesDataModel[i]));
        }
      }

      return nodesViewModel;
    };

    //
    // View model for a connection.
    //
    model.ConnectionViewModel = function (connectionDataModel, sourceConnector, destConnector) {

      model.data = connectionDataModel;
      model.source = sourceConnector;
      model.dest = destConnector;

      // Set to true when the connection is selected.
      model._selected = false;

      model.name = function () {
        return model.data.name || "";
      };

      model.sourceCoordX = function () {
        return model.source.parentNode().x() + model.source.x();
      };

      model.sourceCoordY = function () {
        return model.source.parentNode().y() + model.source.y();
      };

      model.sourceCoord = function () {
        return {
          x: model.sourceCoordX(),
          y: model.sourceCoordY()
        };
      };

      model.sourceTangentX = function () {
        return model.computeConnectionSourceTangentX(model.sourceCoord(), model.destCoord());
      };

      model.sourceTangentY = function () {
        return model.computeConnectionSourceTangentY(model.sourceCoord(), model.destCoord());
      };

      model.destCoordX = function () {
        return model.dest.parentNode().x() + model.dest.x();
      };

      model.destCoordY = function () {
        return model.dest.parentNode().y() + model.dest.y();
      };

      model.destCoord = function () {
        return {
          x: model.destCoordX(),
          y: model.destCoordY()
        };
      };

      model.destTangentX = function () {
        return model.computeConnectionDestTangentX(model.sourceCoord(), model.destCoord());
      };

      model.destTangentY = function () {
        return model.computeConnectionDestTangentY(model.sourceCoord(), model.destCoord());
      };

      model.middleX = function (scale) {
        if (typeof(scale) == "undefined")
          scale = 0.5;
        return model.sourceCoordX() * (1 - scale) + model.destCoordX() * scale;
      };

      model.middleY = function (scale) {
        if (typeof(scale) == "undefined")
          scale = 0.5;
        return model.sourceCoordY() * (1 - scale) + model.destCoordY() * scale;
      };


      //
      // Select the connection.
      //
      model.select = function () {
        model._selected = true;
      };

      //
      // Deselect the connection.
      //
      model.deselect = function () {
        model._selected = false;
      };

      //
      // Toggle the selection state of the connection.
      //
      model.toggleSelected = function () {
        model._selected = !model._selected;
      };

      //
      // Returns true if the connection is selected.
      //
      model.selected = function () {
        return model._selected;
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
    model.computeConnectionSourceTangentX = function (pt1, pt2) {

      return pt1.x + computeConnectionTangentOffset(pt1, pt2);
    };

    //
    // Compute the tangent for the bezier curve.
    //
    model.computeConnectionSourceTangentY = function (pt1, pt2) {

      return pt1.y;
    };

    //
    // Compute the tangent for the bezier curve.
    //
    model.computeConnectionSourceTangent = function (pt1, pt2) {
      return {
        x: model.computeConnectionSourceTangentX(pt1, pt2),
        y: model.computeConnectionSourceTangentY(pt1, pt2),
      };
    };

    //
    // Compute the tangent for the bezier curve.
    //
    model.computeConnectionDestTangentX = function (pt1, pt2) {

      return pt2.x - computeConnectionTangentOffset(pt1, pt2);
    };

    //
    // Compute the tangent for the bezier curve.
    //
    model.computeConnectionDestTangentY = function (pt1, pt2) {

      return pt2.y;
    };

    //
    // Compute the tangent for the bezier curve.
    //
    model.computeConnectionDestTangent = function (pt1, pt2) {
      return {
        x: model.computeConnectionDestTangentX(pt1, pt2),
        y: model.computeConnectionDestTangentY(pt1, pt2),
      };
    };

    //
    // View model for the chart.
    //
    model.ChartViewModel = function (chartDataModel) {

      //
      // Find a specific node within the chart.
      //
      model.findNode = function (nodeID) {

        for (var i = 0; i < model.nodes.length; ++i) {
          var node = model.nodes[i];
          if (node.data.id == nodeID) {
            return node;
          }
        }

        throw new Error("Failed to find node " + nodeID);
      };

      //
      // Find a specific input connector within the chart.
      //
      model.findInputConnector = function (nodeID, connectorIndex) {

        var node = model.findNode(nodeID);

        if (!node.inputConnectors || node.inputConnectors.length <= connectorIndex) {
          throw new Error("Node " + nodeID + " has invalid input connectors.");
        }

        return node.inputConnectors[connectorIndex];
      };

      //
      // Find a specific output connector within the chart.
      //
      model.findOutputConnector = function (nodeID, connectorIndex) {

        var node = model.findNode(nodeID);

        if (!node.outputConnectors || node.outputConnectors.length <= connectorIndex) {
          throw new Error("Node " + nodeID + " has invalid output connectors.");
        }

        return node.outputConnectors[connectorIndex];
      };

      //
      // Create a view model for connection from the data model.
      //
      model._createConnectionViewModel = function (connectionDataModel) {

        var sourceConnector = model.findOutputConnector(connectionDataModel.source.nodeID, connectionDataModel.source.connectorIndex);
        var destConnector = model.findInputConnector(connectionDataModel.dest.nodeID, connectionDataModel.dest.connectorIndex);
        return new model.ConnectionViewModel(connectionDataModel, sourceConnector, destConnector);
      };

      //
      // Wrap the connections data-model in a view-model.
      //
      model._createConnectionsViewModel = function (connectionsDataModel) {

        var connectionsViewModel = [];

        if (connectionsDataModel) {
          for (var i = 0; i < connectionsDataModel.length; ++i) {
            connectionsViewModel.push(model._createConnectionViewModel(connectionsDataModel[i]));
          }
        }

        return connectionsViewModel;
      };

      // Reference to the underlying data.
      model.data = chartDataModel;

      // Create a view-model for nodes.
      model.nodes = createNodesViewModel(model.data.nodes);

      // Create a view-model for connections.
      model.connections = model._createConnectionsViewModel(model.data.connections);

      //
      // Create a view model for a new connection.
      //
      model.createNewConnection = function (startConnector, endConnector) {

        var connectionsDataModel = model.data.connections;
        if (!connectionsDataModel) {
          connectionsDataModel = model.data.connections = [];
        }

        var connectionsViewModel = model.connections;
        if (!connectionsViewModel) {
          connectionsViewModel = model.connections = [];
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

        var connectionViewModel = new model.ConnectionViewModel(connectionDataModel, outputConnector, inputConnector);
        connectionsViewModel.push(connectionViewModel);
      };

      //
      // Add a node to the view model.
      //
      model.addNode = function (nodeDataModel) {
        if (!model.data.nodes) {
          model.data.nodes = [];
        }

        //
        // Update the data model.
        //
        model.data.nodes.push(nodeDataModel);

        //
        // Update the view model.
        //
        model.nodes.push(new model.NodeViewModel(nodeDataModel));
      }

      //
      // Select all nodes and connections in the chart.
      //
      model.selectAll = function () {

        var nodes = model.nodes;
        for (var i = 0; i < nodes.length; ++i) {
          var node = nodes[i];
          node.select();
        }

        var connections = model.connections;
        for (var j = 0; j < connections.length; ++j) {
          var connection = connections[j];
          connection.select();
        }
      }

      //
      // Deselect all nodes and connections in the chart.
      //
      model.deselectAll = function () {

        var nodes = model.nodes;
        for (var i = 0; i < nodes.length; ++i) {
          var node = nodes[i];
          node.deselect();
        }

        var connections = model.connections;
        for (var i = 0; i < connections.length; ++i) {
          var connection = connections[i];
          connection.deselect();
        }
      };

      //
      // Update the location of the node and its connectors.
      //
      model.updateSelectedNodesLocation = function (deltaX, deltaY) {

        var selectedNodes = model.getSelectedNodes();

        for (var i = 0; i < selectedNodes.length; ++i) {
          var node = selectedNodes[i];
          node.data.x += deltaX;
          node.data.y += deltaY;
        }
      };

      //
      // Handle mouse click on a particular node.
      //
      model.handleNodeClicked = function (node, ctrlKey) {

        if (ctrlKey) {
          node.toggleSelected();
        }
        else {
          model.deselectAll();
          node.select();
        }

        // Move node to the end of the list so it is rendered after all the other.
        // model is the way Z-order is done in SVG.

        var nodeIndex = model.nodes.indexOf(node);
        if (nodeIndex == -1) {
          throw new Error("Failed to find node in view model!");
        }
        model.nodes.splice(nodeIndex, 1);
        model.nodes.push(node);
      };

      //
      // Handle mouse down on a connection.
      //
      model.handleConnectionMouseDown = function (connection, ctrlKey) {

        if (ctrlKey) {
          connection.toggleSelected();
        }
        else {
          model.deselectAll();
          connection.select();
        }
      };

      //
      // Delete all nodes and connections that are selected.
      //
      model.deleteSelected = function () {

        var newNodeViewModels = [];
        var newNodeDataModels = [];

        var deletedNodeIds = [];

        //
        // Sort nodes into:
        //		nodes to keep and
        //		nodes to delete.
        //

        for (var nodeIndex = 0; nodeIndex < model.nodes.length; ++nodeIndex) {

          var node = model.nodes[nodeIndex];
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
        for (var connectionIndex = 0; connectionIndex < model.connections.length; ++connectionIndex) {

          var connection = model.connections[connectionIndex];
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
        model.nodes = newNodeViewModels;
        model.data.nodes = newNodeDataModels;
        model.connections = newConnectionViewModels;
        model.data.connections = newConnectionDataModels;
      };

      //
      // Select nodes and connections that fall within the selection rect.
      //
      model.applySelectionRect = function (selectionRect) {

        model.deselectAll();

        for (var i = 0; i < model.nodes.length; ++i) {
          var node = model.nodes[i];
          if (node.x() >= selectionRect.x &&
            node.y() >= selectionRect.y &&
            node.x() + node.width() <= selectionRect.x + selectionRect.width &&
            node.y() + node.height() <= selectionRect.y + selectionRect.height) {
            // Select nodes that are within the selection rect.
            node.select();
          }
        }

        for (var i = 0; i < model.connections.length; ++i) {
          var connection = model.connections[i];
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
      model.getSelectedNodes = function () {
        var selectedNodes = [];

        for (var i = 0; i < model.nodes.length; ++i) {
          var node = model.nodes[i];
          if (node.selected()) {
            selectedNodes.push(node);
          }
        }

        return selectedNodes;
      };

      //
      // Get the array of connections that are currently selected.
      //
      model.getSelectedConnections = function () {
        var selectedConnections = [];

        for (var i = 0; i < model.connections.length; ++i) {
          var connection = model.connections[i];
          if (connection.selected()) {
            selectedConnections.push(connection);
          }
        }

        return selectedConnections;
      };


    };

    return model;

  }

})();

