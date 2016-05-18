(function(angular) {
  angular.module('workflowEditor')
    .directive('sidebar', ['$animate', '$document', function($animate, $document) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          if (!element.hasClass('sidebar')) element.addClass('sidebar');
          if (!element.hasClass('sidebar-left') &&
            !element.hasClass('sidebar-right')) element.addClass('sidebar-left');
          if (!scope.$eval(attrs.sidebar) &&
            element.hasClass('sidebar-open')) element.removeClass('sidebar-open');

          function show() {
            if (element.hasClass('sidebar-open')) return;
            $animate.addClass(element, 'sidebar-open');
          }

          function hide() {
            if (!element.hasClass('sidebar-open')) return;
            $animate.removeClass(element, 'sidebar-open');
          }

          scope.$watch(attrs.sidebar, function(newValue) {
            newValue ? show() : hide();
          });

          if (attrs.clickOutside) {
            function handler(event) {
              if (!event || !event.target) return;
              for (var e = event.target; e != null; e = e.parentNode) {
                var element = angular.element(e);
                if (element.hasClass('sidebar') ||
                  element.hasClass('toggle-sidebar')) return;
              }
              scope.$apply(attrs.clickOutside);
            }

            $document.on('click', handler);

            scope.$on('$destroy', function() {
              $document.off('click', handler);
            });
          }
        }
      };
    }]);
})(angular);
