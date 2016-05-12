(function() {
  'use strict';

  angular
    .module('workflowEditor')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, NodeTemplatePathProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-bottom-left';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    NodeTemplatePathProvider.setTemplatePath("path/to/your/template/node.html");

  }

})();
