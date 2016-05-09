(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .directive('flowchart', flowchart);

  /** @ngInject */
  function flowchart(svgCompile) {
    // sd.js svgCompile service solves the problems with SVG paths being treated as dummy HTML nodes and not showing up
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











