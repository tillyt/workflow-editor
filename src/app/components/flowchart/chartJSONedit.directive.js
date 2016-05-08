(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .directive('chartJsonEdit', chartJsonEdit);

  function chartJsonEdit(modelService) {
    return {
      restrict: 'A',
      scope: {
        viewModel: "="
      },
      link: function (scope, elem) {

        // Serialize the data model as json and update the textarea.
        var updateJson = function () {
          if (scope.viewModel) {
            var json = angular.toJson(scope.viewModel.data, null, 4);
            elem.val(json);
          }
        };

        // First up, set the initial value of the textarea.
        updateJson();

        // Watch for changes in the data model and update the textarea whenever necessary.
        scope.$watch("viewModel.data", updateJson, true);

        // Handle the change event from the textarea and update the data model
        // from the modified json.
        angular.element(elem).bind("input propertychange", function () {
          var json = angular.element(elem).val();
          var dataModel = angular.fromJson(json);
          scope.viewModel = new modelService.ChartViewModel(dataModel);

          scope.$digest();
        });
      }
    };
  }


})();
