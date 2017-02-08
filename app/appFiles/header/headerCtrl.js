angular.module('ssoApp')

.controller('headerCtrl', ['$scope', 'contentService', '$location', 'getClient','loadBrandingService', '$http', 'Constants', '$state', '$window', 'httpService', 'displayResponseBox', 'tokenValidationService', 'tokenStorageService', function ($scope, contentService, $location, getClient, loadBrandingService, $http, Constants, $state, $window, httpService, displayResponseBox, tokenValidationService, tokenStorageService){

  var self = this;

          $scope.styles = loadBrandingService.getStyles();
          // $scope.clientContent = contentService.getMultiClientContent();
          $scope.sessionTimeout = loadBrandingService.sessionTimeout()

  console.log("Header Ctrl");

  self.homeLink = '/#/login';
  self.logoLink = 'https://imc2-staging2.csid.com/login?RTN=90000013';

  self.changeHref = function() {

    self.logoLink = getClient();

    if($location.path() == '/member/profile') {
      self.homeLink = 'http://imc2-staging2.csid.com/dashboard';
    }
  };


  $(document).click(function (event) {
    var clickover = $(event.target);
    var $navbar = $(".navbar-collapse");
    var _opened = $navbar.hasClass("in");
    if (_opened === true && !clickover.hasClass("navbar-toggle")) {
        $navbar.collapse('hide');
    }
});
}]);
