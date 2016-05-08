(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, nipypePackages, toastr, viewModel) {
    var vm = this;

    vm.classAnimation = '';
    vm.showToastr = showToastr;

    activate();

    function activate() {
      getNipypePackages();
      $timeout(function () {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr(message) {
      toastr.info(message);
      vm.classAnimation = '';
    }

    function getNipypePackages() {
      vm.packages = nipypePackages.getNipypePackages();
      vm.interfaces = vm.packages.interfaces;
      vm.modules = vm.packages.modules;
      vm.submodules = vm.modules[""].submodules;
    }



    vm.width = function (node) {
      var num_inputs = Object.keys(node.interface.inputs).length;
      var num_chars_in_name = node.interface.name.length;
      var num_outputs = Object.keys(node.interface.outputs).length;
      var max_num_connectors = Math.max(num_inputs, num_outputs);
      var text_width = Math.round(num_chars_in_name * 11);
      var connector_width = 15 + max_num_connectors *15;
      if (connector_width > text_width) {
        return (14*(max_num_connectors-1))+56;
      } else {
        return text_width;
      }
    };




    //
    // Code for the delete key.
    //
    var deleteKeyCode = 46;

    //
    // Code for control key.
    //
    var ctrlKeyCode = 17;

    //
    // Set to true when the ctrl key is down.
    //
    var ctrlDown = false;

    //
    // Code for A key.
    //
    var aKeyCode = 65;

    //
    // Code for esc key.
    //
    var escKeyCode = 27;

    //
    // Selects the next node id.
    //
    var nextNodeID = 10;

    //
    // Setup the data-model for the chart.
    //
    var chartDataModel = {

      nodes: [
        {
          name: "Example Node 1",
          id: 0,
          x: 0,
          y: 0,
          width: 350,
          inputConnectors: [
            {
              name: "A"
            },
            {
              name: "B"
            },
            {
              name: "C"
            }
          ],
          outputConnectors: [
            {
              name: "A"
            },
            {
              name: "B"
            },
            {
              name: "C"
            }
          ]
        },

        {
          name: "Example Node 2",
          id: 1,
          x: 400,
          y: 200,
          inputConnectors: [
            {
              name: "A"
            },
            {
              name: "B"
            },
            {
              name: "C"
            }
          ],
          outputConnectors: [
            {
              name: "A"
            },
            {
              name: "B"
            },
            {
              name: "C"
            }
          ]
        }

      ],

      connections: [
        {
          name:'Connection 1',
          source: {
            nodeID: 0,
            connectorIndex: 1
          },

          dest: {
            nodeID: 1,
            connectorIndex: 2
          }
        },
        {
          name:'Connection 2',
          source: {
            nodeID: 0,
            connectorIndex: 0
          },

          dest: {
            nodeID: 1,
            connectorIndex: 0
          }
        }

      ]
    };

    //
    // Event handler for key-down on the flowchart.
    //
    vm.keyDown = function (evt) {

      if (evt.keyCode === ctrlKeyCode) {

        ctrlDown = true;
        evt.stopPropagation();
        evt.preventDefault();
      }
    };

    //
    // Event handler for key-up on the flowchart.
    //
    vm.keyUp = function (evt) {

      if (evt.keyCode === deleteKeyCode) {
        //
        // Delete key.
        //
        vm.chartViewModel.deleteSelected();
      }

      if (evt.keyCode == aKeyCode && ctrlDown) {
        //
        // Ctrl + A
        //
        vm.chartViewModel.selectAll();
      }

      if (evt.keyCode == escKeyCode) {
        // Escape.
        vm.chartViewModel.deselectAll();
      }

      if (evt.keyCode === ctrlKeyCode) {
        ctrlDown = false;

        evt.stopPropagation();
        evt.preventDefault();
      }
    };

    //
    // Add a new node to the chart.
    //
    vm.addNewNode = function () {

      var nodeName = prompt("Enter a node name:", "New node");
      if (!nodeName) {
        return;
      }

      //
      // Template for a new node.
      //
      var newNodeDataModel = {
        name: nodeName,
        id: nextNodeID++,
        x: 0,
        y: 0,
        inputConnectors: [
          {
            name: "X"
          },
          {
            name: "Y"
          },
          {
            name: "Z"
          }
        ],
        outputConnectors: [
          {
            name: "1"
          },
          {
            name: "2"
          },
          {
            name: "3"
          }
        ]
      };

      vm.chartViewModel.addNode(newNodeDataModel);
    };

    //
    // Delete selected nodes and connections.
    //
    vm.deleteSelected = function () {

      vm.chartViewModel.deleteSelected();
    };

    //
    // Create the view-model for the chart and attach to the scope.
    //
    vm.chartViewModel = new viewModel.ChartViewModel(chartDataModel);


    console.log(vm.chartViewModel);







  }
})();
