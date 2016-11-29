'use strict';

//SPECIAL
angular.module('ssoApp')
  .controller('loginCtrl', ['$scope', 'Constants', '$http', '$state', '$rootScope', 'httpService', 'displayResponseBox', '$window', '$location', 'tokenStorageService', 'loadBrandingService',function($scope, Constants, $http, $state, $rootScope, httpService, displayResponseBox, $window, $location, tokenStorageService, loadBrandingService) {
      // console.log("Entering Login Ctrl");

      var self = this;

      self.response = null;
      self.error = null;
      $scope.removeAndRedirect = null;

      self.signUpData = {
        MembershipNumber: null,
        ZipCode: null,
        LastName: null,
        AntiForgeryTokenId: null
      }

      self.loginData = {
        Username: null,
        Password: null,
        LoginSourceId: Constants.loginSourceId,
        AntiForgeryTokenId: null
      }

      self.regex = {
        ZipCode : Constants.regexs.zip,
        LastName : Constants.regexs.names,
        username : Constants.regexs.username,
        password : Constants.regexs.password,
        anything : Constants.regexs.anything,
      }

      self.responseBoxConfig = displayResponseBox.checkMessage()

      //runs if the request has an http error
      self.error = function (err) {
                if (err.data.responseObject != null) {
          $location.url( err.data.responseObject.pingToken )
        } else {
            var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
          displayResponseBox.populateResponseBox(self.responseBoxConfig, message, true)
        }



      }

      self.checkForTerms = function (res) {
        return res.data && res.data.responseObject && res.data.responseObject.pingToken.match(/terms-accept/);
      }

      self.checkForAccountActivation = function (res) {
        return res.data && res.data.responseObject && res.data.responseObject.pingToken.match(/account-activation/);
      }

      // self.loginError = function (err) {
      //   if (self.checkForTerms(err)) {
      //     $location.url( err.data.responseObject.slice(2) )
      //   } else {
      //     self.error(err)
      //   }
      // }

      self.activationSuccess = function (res) {
        // $state.go('sign-up', { token : res.data.responseObject })
        tokenStorageService.setToken(res.data.responseObject);
        $state.go('sign-up')
      }

       console.log(loadBrandingService._styles.pingURL);

       self.loginSuccess = function (res) {

      if (res.data.errorType == 200) {
        console.log("Login Success");
        tokenStorageService.setToken(res.data.responseObject.sessionToken);

        if ( self.checkForTerms(res) ) {
          $location.url( res.data.responseObject.pingToken )
 }
       else if ( self.checkForAccountActivation(res) ) {
          $location.url( res.data.responseObject.pingToken + "?token=" + res.data.responseObject.sessionToken )
       }

        else {
          console.log(res.data.responseObject);
          console.log(loadBrandingService._styles.pingURL + res.data.responseObject.pingToken)
          $window.location.assign(loadBrandingService._styles.pingURL + res.data.responseObject.pingToken)
        }
      }
       }

      self.loginRequest = function (event) {
        // console.log('loginCtrl.loginRequest')
        event.preventDefault()
        $('.loginProcessingBtn').button('loading');
        httpService.login(self.loginData)
          .then(self.loginSuccess, self.error)
          .finally(function () { $('.loginProcessingBtn').button('reset'); })
      }

      self.activationRequest = function (event) {
        event.preventDefault();
        $('.signUpProcessingBtn').button('loading');
        httpService.activate(self.signUpData)
          .then(self.activationSuccess, self.error)
          .finally(function () { $('.signUpProcessingBtn').button('reset'); })
      };

          self.populateAntiForgeryToken = function(res) {
            console.log("Antiforgery" + res);
            self.signUpData.AntiForgeryTokenId =  res.data
            self.loginData.AntiForgeryTokenId =  res.data
          }

 //      $http.get('https://mws.stage.kroll.com/api/v1/security/tokens')
 //        .then(self.populateAntiForgeryToken, self.error);
 //
 }]);

 // $scope.$on('$locationChangeStart', function (event, next, current) {
 //   // console.log(current);
 //   if (current.match("\/login")) {
 //     // console.log("Clicked on body")
 //     $rootScope.responseBox.displayBox = false;
 //     // console.log("self.responseBox.displayBox" + self.responseBox.displayBox)
 //   }
 // })
 //
 // self.showBox = function() {
 //   $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
 //     //assign the "from" parameter to something
 //     if (from.name == "forgot-password" || from.name == "reset-password") {
 //       self.displayBox = true;
 //     }
 //   });
 // }
