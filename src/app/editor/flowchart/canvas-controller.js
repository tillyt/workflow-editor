(function() {

  'use strict';

  function canvasController($rootScope, Mouseoverfactory, Nodedraggingfactory, Modelfactory, Edgedraggingfactory, Edgedrawingservice) {
    var vm = this;

    vm.nodeCallbacks = vm.nodeCallbacks || {};
    vm.automaticResize = vm.automaticResize || false;
    angular.forEach(vm.nodeCallbacks, function(callback, key) {
      if (!angular.isFunction(callback) && key !== 'nodeCallbacks') {
        throw new Error('All callbacks should be functions.');
      }
    });

    vm.modelservice = Modelfactory(vm.model, vm.selectedObjects, vm.nodeCallbacks.edgeAdded || angular.noop);

    vm.nodeDragging = {};
    var nodedraggingservice = Nodedraggingfactory(vm.modelservice, vm.nodeDragging, $rootScope.$apply.bind($rootScope), vm.automaticResize);

    vm.edgeDragging = {};
    var edgedraggingservice = Edgedraggingfactory(vm.modelservice, vm.model, vm.edgeDragging, vm.nodeCallbacks.isValidEdge || null, $rootScope.$apply.bind($rootScope));

    vm.mouseOver = {};
    var mouseoverservice = Mouseoverfactory(vm.mouseOver, $rootScope.$apply.bind($rootScope));

    vm.edgeMouseEnter = mouseoverservice.edgeMouseEnter;
    vm.edgeMouseLeave = mouseoverservice.edgeMouseLeave;

    vm.canvasClick = vm.modelservice.deselectAll;

    vm.drop = nodedraggingservice.drop;
    vm.dragover = function(event) {
      nodedraggingservice.dragover(event);
      edgedraggingservice.dragover(event);
    };

    vm.edgeClick = function(event, edge) {
      vm.modelservice.edges.handleEdgeMouseClick(edge, event.ctrlKey);
      // Don't let the chart handle the mouse down.
      event.stopPropagation();
      event.preventDefault();
    };

    vm.edgeDoubleClick = vm.nodeCallbacks.edgeDoubleClick || angular.noop;
    vm.edgeMouseOver = vm.nodeCallbacks.edgeMouseOver || angular.noop;

    vm.userNodeCallbacks = vm.nodeCallbacks.nodeCallbacks;
    vm.callbacks = {
      nodeDragstart: nodedraggingservice.dragstart,
      nodeDragend: nodedraggingservice.dragend,
      edgeDragstart: edgedraggingservice.dragstart,
      edgeDragend: edgedraggingservice.dragend,
      edgeDrop: edgedraggingservice.drop,
      edgeDragoverConnector: edgedraggingservice.dragoverConnector,
      edgeDragoverMagnet: edgedraggingservice.dragoverMagnet,
      nodeMouseOver: mouseoverservice.nodeMouseOver,
      nodeMouseOut: mouseoverservice.nodeMouseOut,
      connectorMouseEnter: mouseoverservice.connectorMouseEnter,
      connectorMouseLeave: mouseoverservice.connectorMouseLeave,
      nodeClicked: function(node) {
        return function(event) {
          vm.modelservice.nodes.handleClicked(node, event.ctrlKey);
          vm.$apply();

          // Don't let the chart handle the mouse down.
          event.stopPropagation();
          event.preventDefault();
        }
      }
    };

    vm.getEdgeDAttribute = Edgedrawingservice.getEdgeDAttribute;
  }

  angular
    .module('workflowEditor')
    .controller('canvasController', canvasController);

}());


