(function () {
  'use strict';

  angular
    .module('workflowEditor')
    .directive('destination', destination);

  /** @ngInject */
  function destination() {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {


      }

    }
  }

})();











