'use strict';

//SPECIAL
angular.module('ssoApp')
  .controller('contactCtrl', ['$scope', 'Constants', '$http', '$state', '$rootScope', 'httpService', 'displayResponseBox', '$window', '$location', 'tokenStorageService', 'loadBrandingService',function($scope, Constants, $http, $state, $rootScope, httpService, displayResponseBox, $window, $location, tokenStorageService, loadBrandingService) {
      
      var self = this;
      
      self.checkCookie();
  
      self.checkCookie = function () {
        tokenStorageService.refreshCookie();
      };
    }]);