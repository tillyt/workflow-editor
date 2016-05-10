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
      scope: {
        model: '=',
        defaultNodeWidth: '=',
        nodeHeight: '=',
        editorWidth: '=',
        editorHeight: '='
      },
      controller: 'WorkflowController',
      controllerAs: 'vm',
      bindToController: true


    }

  }

})();











