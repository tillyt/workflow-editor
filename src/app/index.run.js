(function() {
  'use strict';

  angular
    .module('workflowEditor')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
