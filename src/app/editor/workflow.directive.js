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
        editorHeight: '=',
        deleteNode: '&',
        selectedItems: '='
      },
      link: function (scope, elem, attrs) {
        console.log(scope);
        console.log(scope.model.nodes);

        scope.$watch('model', function (value) {
          // var currentDate = moment(attrs.calendarDay, "DD-MM-YYYY");
          // element.text(currentDate.format('DD-MM-YYYY'));
        }, true);
      }


    }

  }

})();











