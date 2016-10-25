angular.module('ssoApp')
    .directive('sessionPopup', ['httpService', function (httpService) {
          return {
            templateUrl: 'scripts/directives/sessionPopup/sessionPopup.html'
        };
}])