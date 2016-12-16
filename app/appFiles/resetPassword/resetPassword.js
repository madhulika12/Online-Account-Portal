'use strict';
angular.module('ssoApp')
    .controller('resetPasswordCtrl', ['antiForgeryToken','tokenStorageService', '$http','$scope', 'Constants', 'httpService', '$state', 'loadBrandingService', 'tokenValidationService', 'displayResponseBox', 'getUrl',  function(antiForgeryToken, tokenStorageService, $http, $scope, Constants, httpService, $state, loadBrandingService, tokenValidationService, displayResponseBox, getUrl) {

        var self = this;

        //Red Arrows next to password requirements
        //*******************************************************
        // self.valid, the $watch, and self.checkRequirements are what display the red arrows to show users what part of their password is still incorrect.
        self.valid = {
          length : false,
          lowerCase : false,
          upperCase : false,
          number : false
        }

        self.checkRequirements = function () {
          var val = self.form.password.$viewValue || ""
          self.valid = {
            length : val.match(self.regex.length),
            lowerCase : val.match(self.regex.lowerCase),
            upperCase : val.match(self.regex.upperCase),
            number : val.match(self.regex.number)
          }
        }
        //*******************************************************

        self.regex = {
          password : Constants.regexs.password,
          length : /.{8,15}/,
          lowerCase : /[a-z]/,
          upperCase : /[A-Z]/,
          number : /\d/
        }

        self.data = {
          Password : null,
          Jwt : tokenValidationService.getJWT(),
          AntiForgeryTokenId: null,
          ClientUrl: getUrl()
        }

        self.responseBoxConfig = {
          message : null,
          error : false,
          display : false
        }

        // FUNCTIONS TO SET THE PASSWORD
        //***************************************************

        self.setPasswordRequest = function (event) {
          event.preventDefault()
          $('.processingBtn').button('loading');
          httpService.setPassword(self.data)
            .then(self.successMessage, self.error)
            .finally(function () { $('.processingBtn').button('reset'); })
        }

        self.successMessage = function(res) {
          // console.log('resetPassword.successMessage res params', res)
          displayResponseBox.setMessage("The password for your account was successfully reset. Please use the new password to log into the mobile app as well as the web portal.", false)
          $state.go('login');
          antiForgeryToken.setAntiForgeryToken(res);
        }

        self.error = function (err) {
          // console.log('resetPassword.error err param', err)
          var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
          displayResponseBox.populateResponseBox(self.responseBoxConfig, message, true);
          antiForgeryToken.setAntiForgeryTokenFromError(err);
        }

        // MODAL FUNCTIONS
        //*************************************************

        self.showResetModal = function () {
          $('#password-reset-expired-modal').modal('show')
          $('#password-reset-expired-modal').on('hidden.bs.modal', function () {
            $state.go('login')
          })
        }

        self.backToLogin = function () {
          $('#password-reset-expired-modal').modal('hide')
        }

        //*******************************************************
        //Running Functions
        //*******************************************************

        $scope.$watch(function () { return self.form.password.$viewValue }, function () {
          self.checkRequirements()
        })

        tokenValidationService.checkJWT()
          .catch(self.showResetModal)

      self.populateAntiForgeryToken = function(res) {
            console.log("Antiforgery" + res);
            self.data.AntiForgeryTokenId =  antiForgeryToken.getAntiForgeryToken();
            self.checkCookie();
          }

      self.checkCookie = function () {
        tokenStorageService.refreshCookie();
      };

      self.populateAntiForgeryToken();

      // $http.get('https://mws.stage.kroll.com/api/v1/security/tokens')
      //   .then(self.populateAntiForgeryToken, self.error);

        //*******************************************************

 }]);
