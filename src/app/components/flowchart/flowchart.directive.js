(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .directive('flowchart', flowchart);

  /** @ngInject */
  function flowchart($http, $templateCache, svgCompile) {
    // sd.js svgCompile service solves the problems with SVG paths being treated as dummy HTML nodes and not showing up
    return {
      restrict: 'E',
      // type: 'svg',
      // templateUrl: "app/components/flowchart/flowchart.tmpl.svg",
      // replace: true,
      scope: {
        model: "="
      },
      bindToController: true,
      controller: 'FlowchartController',
      controllerAs: 'vm',
      compile: function (tElement, tAttrs, transclude) {
        return function postLink(scope, iElement, iAttrs, controller) {
          var element = iElement[0],
            _templateUrl = "app/components/flowchart/flowchart.tmpl.svg",
            xpointer = iAttrs['xpointer'],
            parentNode = element.parentNode;
          $http.get(_templateUrl, {
            cache: $templateCache
          }).success(function(response) {
            svgCompile.build(response, iElement, scope, xpointer);
          }).error(function(error) {

          });
        };
      }
    };


  }

})();











