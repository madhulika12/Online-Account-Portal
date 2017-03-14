'use strict';

//SPECIAL
angular.module('ssoApp')
  .controller('contactCtrl', ['contentService','$scope', 'Constants', '$http', '$state', '$rootScope', 'httpService', 'displayResponseBox', '$window', '$location', 'tokenStorageService', 'loadBrandingService',function(contentService, $scope, Constants, $http, $state, $rootScope, httpService, displayResponseBox, $window, $location, tokenStorageService, loadBrandingService) {
      
      var self = this;   
  
      self.checkCookie = function () {
        tokenStorageService.refreshCookie();
      };
      
      self.checkCookie();

      $scope.interchangableComponents = contentService._content;
    }]);