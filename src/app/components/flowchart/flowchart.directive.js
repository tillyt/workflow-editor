(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .directive('flowchart', flowchart);

  /** @ngInject */
  function flowchart() {
    return {
      restrict: 'E',
      templateUrl: "app/components/flowchart/flowchart.tmpl.html",
      replace: true,
      scope: {
        model: "="
      },
      bindToController: true,
      controller: 'FlowchartController',
      controllerAs: 'vm'
    };


  }

})();











