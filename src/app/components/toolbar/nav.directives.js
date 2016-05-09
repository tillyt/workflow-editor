(function() {
  'use strict';
  angular
    .module('workflowEditor')
    .directive('tree', function() {
      return {
        restrict: "E",
        replace: true,
        scope: {
          tree: '='
        },
        templateUrl: 'app/components/toolbar/template-ul.html'
      };
    })
    .directive('leaf', function($compile) {
      return {
        restrict: "E",
        replace: true,
        scope: {
          leaf: "="
        },
        controller: 'MainController',
        controllerAs: 'ctrl',
        templateUrl: 'app/components/toolbar/template-li.html',
        link: function(scope, element, attrs, ctrl) {
          if (angular.isArray(scope.leaf.subtree)) {
            element.append("<tree tree='leaf.subtree'></tree>");
            element.addClass('dropdown-submenu');
            $compile(element.contents())(scope);
          } else {
            element.bind('click', function() {
              ctrl.addNewNode(scope.leaf.name);
            });

          }
        }
      };
    });
})();




