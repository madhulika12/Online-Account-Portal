'use strict';

//SPECIAL
angular.module('ssoApp')
  .controller('contactCtrl', ['$scope', 'Constants', '$http', '$state', '$rootScope', 'httpService', 'displayResponseBox', '$window', '$location', 'tokenStorageService', 'loadBrandingService',function($scope, Constants, $http, $state, $rootScope, httpService, displayResponseBox, $window, $location, tokenStorageService, loadBrandingService) {
      
      var self = this;   
  
      self.checkCookie = function () {
        tokenStorageService.refreshCookie();
      };
      
      self.checkCookie();

      self.interchangableComponents = loadBrandingService.getStyles();
    }]);