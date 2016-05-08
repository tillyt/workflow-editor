(function() {
  'use strict';

  angular
    .module('workflowEditor')
    .directive('toolbar', toolbar);

  /** @ngInject */
  function toolbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/toolbar/toolbar.html',
      scope: {
        packages: '='
      },
      controller: ToolbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ToolbarController() {
      var vm = this;
      vm.selected = null;
      vm.interfaces = vm.packages.interfaces;
      vm.modules = vm.packages.modules;
      vm.categories = vm.modules[""].submodules;

      angular.forEach(vm.interfaces, function(val, key){
        val.category = key.split('.')[0];
      });
      
      

    }
  }

})();
