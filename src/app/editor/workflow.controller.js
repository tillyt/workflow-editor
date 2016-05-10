(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .controller('WorkflowController', WorkflowController);

  /** @ngInject */
  function WorkflowController($window, hotkeys) {
    var vm = this;





    vm.nodeSelected = null;

    vm.menuOpen = false;

    function updateModel(updatedModel) {
      // TODO
      // modelService.setModel(updatedModel);
    }




    vm.deleteSelected = function () {
      //TODO
      vm.model.deleteSelected();
    };

    hotkeys.add({
      combo: 'del',
      description: 'Delete Selected Nodes and Edges',
      callback: function(){
        vm.deleteSelected();
      }
    });

    hotkeys.add({
      combo: 'ctrl+a',
      description: 'Select All Nodes and Edges',
      callback: function(){
        vm.selectAll();
      }
    });

    vm.deleteNode = function (node_id) {
      //TODO
      console.log('TODO delete node');
      // vm.modelService.deleteSelected();
    };

    vm.editorWidth = $window.innerWidth;
    vm.editorHeight = $window.innerHeight;


    vm.selectedItems = [];

    // node width determined based on width of connectors or name, whichever's bigger
    vm.nodeWidth = function (node) {
      var num_inputs = Object.keys(node.interface.inputs).length;
      var num_chars_in_name = node.interface.name.length;
      var num_outputs = Object.keys(node.interface.outputs).length;
      var max_num_connectors = Math.max(num_inputs, num_outputs);
      var text_width = Math.round(num_chars_in_name * 11);
      var connector_width = 15 + max_num_connectors * 15;
      if (connector_width > text_width) {
        return (14 * (max_num_connectors - 1)) + 56;
      } else {
        return text_width;
      }
    };



  }
})();
