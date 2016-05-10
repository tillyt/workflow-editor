(function() {
  'use strict';

  angular
    .module('workflowEditor')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-bottom-left';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
  }

})();

// ng-attr-transform="translate({{node.x}}, {{node.y}})"
