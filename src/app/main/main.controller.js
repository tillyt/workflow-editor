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


    vm.width = function (node) {
      var num_inputs = Object.keys(node.interface.inputs).length;
      var num_chars_in_name = node.interface.name.length;
      var num_outputs = Object.keys(node.interface.outputs).length;
      var max_num_connectors = Math.max(num_inputs, num_outputs);
      var text_width = Math.round(num_chars_in_name * 11);
      var connector_width = 15 + max_num_connectors * 15;
      if (connector_width > text_width) {
        return (14 * (max_num_connectors - 1)) + 56;
      } else {
        return text_width;
      }
    };


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

      modelService.addNode(nipype_interface);
    };


    vm.deleteSelected = function () {
      //TODO
      vm.model.deleteSelected();
    };


  }
})();
