angular.module('ssoApp')

.controller('headerCtrl', ['$location','loadBrandingService', '$http', 'Constants', '$state', '$window', 'httpService', 'displayResponseBox', 'tokenValidationService', 'tokenStorageService', function ($location, loadBrandingService, $http, Constants, $state, $window, httpService, displayResponseBox, tokenValidationService, tokenStorageService){

  var self = this;
  console.log("Header Ctrl");
  self.homeLink = '/#/login'

  self.changeHref = function() {
    if($location.path() == '/member/profile') {
      self.homeLink = 'http://imc2-staging2.csid.com/dashboard'
    }
  }
}]);
