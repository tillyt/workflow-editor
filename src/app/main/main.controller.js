(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, nipypePackages, toastr, modelService, localStorageService) {
    var vm = this;

    vm.classAnimation = '';
    vm.showToastr = showToastr;
    vm.model = {};

    activate();

    function activate() {
      getNipypePackages();
      getModel();
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


    function getModel() {
      vm.model = modelService.getModel();
      localStorageService.set('model', vm.model);
    }





    // keyboard shortcuts

    var keyCodes = {17: 'ctrl', 8: 'del', 27: 'esc', 65: 'a', 78: 'n'};
    var ctrlDown = false;

    vm.keyDown = function (e) {
      if (keyCodes[e.keyCode] === 'ctrl') {
        ctrlDown = true;
        e.stopPropagation();
        e.preventDefault();
      }
    };

    vm.keyUp = function (e) {
      if (keyCodes[e.keyCode] === 'del') {
        vm.deleteSelected();
      } else if (keyCodes[e.keyCode] === 'a' && ctrlDown) {
        // cmd + A select all
        vm.selectAll();
      } else if (keyCodes[e.keyCode] === 'esc') {
        // escape key to deselect all
        vm.deselectAll();
      } else if (keyCodes[e.keyCode] === 'cmd') {
        ctrlDown = false;
        e.stopPropagation();
        e.preventDefault();
      } else if (keyCodes[e.keyCode] === 'a' && ctrlDown) {
        // cmd + N new node
        vm.addNewNode();
        e.stopPropagation();
        e.preventDefault();
      }
    };


    vm.addNewNode = function (nipype_interface) {
      alert('oh hey it worked');
      modelService.addNode(nipype_interface);
    };


    vm.deleteSelected = function () {
      //TODO
      vm.model.deleteSelected();
    };


  }
})();
