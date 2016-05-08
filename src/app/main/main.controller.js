(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, nipypePackages, toastr) {
    var vm = this;
    
    vm.classAnimation = '';
    vm.showToastr = showToastr;

    activate();

    function activate() {
      getNipypePackages();
      $timeout(function () {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr(message) {
      toastr.info(message);
      vm.classAnimation = '';
    }

    function getNipypePackages() {
      vm.packages = nipypePackages.getNipypePackages();
      vm.interfaces = vm.packages.interfaces;
      vm.modules = vm.packages.modules;
      vm.submodules = vm.modules[""].submodules;
    }
  }
  
  
  
})();
