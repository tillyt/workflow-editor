(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .directive('flowchart', flowchart);

  /** @ngInject */
  function flowchart() {
    return {
      restrict: 'E',
      type: 'svg',
      templateUrl: "app/components/flowchart/flowchart.tmpl.svg",
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











