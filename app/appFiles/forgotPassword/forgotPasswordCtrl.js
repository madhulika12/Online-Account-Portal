'use strict';
angular.module('ssoApp')
.controller('forgotPasswordCtrl', ['tokenStorageService', '$scope', 'Constants', '$http', '$state', '$rootScope', 'getUrl', function(tokenStorageService, $scope, Constants, $http, $state, $rootScope, getUrl) {

    var self = this;

    self.regex = {
      username : Constants.regexs.username
    }

    // self.forgotPasswordData = {
    //   username : null,
    //   url : getUrl()
    // }

    self.forgotPasswordData = {
      username : null,
      LoginSourceID: null,
      AntiForgeryTokenId: null
    }

    $rootScope.responseBox = {
      message: "Thank you. You will receive an email in the next 5 minutes with instructions to reset your password. If you don't receive the email, please check your junk email folder or contact customer support for further assistance.",
      error: false,
      displayBox: true
    }

    // console.log(self.forgotPasswordData.username);

    self.recoverPasswordRequest = function (event) {
      event.preventDefault()

      $http
        .post(Constants.endpoints.forgotPassword, self.forgotPasswordData)
        .then(function(res) {
          //console.log(res);

          //console.debug("Before clearing" + $rootScope.responseBox.displayBox);
          //$scope.$apply();
          $state.go('login');
          // console.log("Inside then" + $rootScope.responseBox.error);
          // //$rootScope = $rootScope.$new(true);
          // console.debug("After clearing" + $rootScope.responseBox);
        })
      //this is a deliberately synchronous redirect, because the response from the post will be the same no matter what

      //console.log("Outside then" + $rootScope.responseBox.error);
    }
    
      self.checkCookie = function () {
        tokenStorageService.refreshCookie();
      };
      
      self.checkCookie();
}]);
