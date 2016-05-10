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
        nodeWidth: '&',
        nodeHeight: '=',
        editorWidth: '=',
        editorHeight: '='
      },
      link: function (scope, elem, attrs) {


        scope.$watch('model', function (value) {
          // var currentDate = moment(attrs.calendarDay, "DD-MM-YYYY");
          // element.text(currentDate.format('DD-MM-YYYY'));
        }, true);
      },
      controller: 'WorkflowController',
      controllerAs: 'vm',
      bindToController: true


    }

  }

})();











