(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .directive('workflow', workflow);

  /** @ngInject */
  function workflow() {
    return {
      restrict: 'E',
      templateUrl: "app/editor/workflow.tmpl.html",
      replace: true,
      transclude: true,
      bindToController: true,
      controllerAs: 'vm',
      controller: function ($window, modelService) {
        var vm = this;

        vm.model = modelService.getModel();

        vm.editorHeight = $window.innerHeight;
        vm.editorWidth = $window.innerWidth;

        vm.nodeHeight = 70;

        vm.nodeDragOptions = {
          container: {left: 0, top: 0, bottom: vm.editorHeight, right: vm.editorWidth - 150 - 10}
        };


        // node width determined based on width of connectors or name, whichever's bigger
        vm.width = function (node) {
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

        vm.deleteNode = function (id) {
          modelService.deleteNode(id);
        }



      },
      link: function (scope, elem, attrs) {
        console.log(scope.model);
      }


    }

  }

})();











