'use strict';
angular.module('ssoApp')
    .controller('updateEmailCtrl', ['antiForgeryToken', '$timeout','tokenStorageService','$http', 'httpService', '$scope', 'Constants', 'tokenValidationService', 'displayResponseBox', '$state', 'usernameService', function(antiForgeryToken, $timeout, tokenStorageService, $http, httpService, $scope, Constants, tokenValidationService, displayResponseBox, $state, usernameService) {

        var self = this;

        self.regex = {
          email : Constants.regexs.email
        }

        self.data = {
          email : null,
          Username : usernameService.getUsername()
        }

        self.updateEmailData = {
          NewEmail : null,
          AntiForgeryTokenId: null,
          SessionId : null
        }

    self.forgotPasswordData = {
      LoginSourceId: 2,
      AntiForgeryTokenId: null,
      SessionId : null
    }

        self.responseBoxConfig = {
          message : null,
          error : false,
          display : false
        }

        //UPDATE EMAIL FUNCTIONS
        //*****************************************
        self.updateEmailSuccess = function (res) {
          antiForgeryToken.setAntiForgeryToken(res);
          $timeout(self.resetPassword(), 3000);
        }

        self.error = function (err) {
          var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
          displayResponseBox.populateResponseBox(self.responseBoxConfig, message, true);
          antiForgeryToken.setAntiForgeryTokenFromError(err);
        }

        self.updateEmailRequest = function (event) {
          event.preventDefault()
          $('.processingBtn').button('loading');
          httpService.updateEmail(self.updateEmailData)
            .then(self.updateEmailSuccess, self.error)
            .finally(function () { $('.processingBtn').button('reset'); })
        }

        // RESET PASSWORD FUNCTIONS
        //***************************************************
        self.resetPasswordSuccess = function (res) {
              var message = res.data.responseObject
              displayResponseBox.setMessage(message, false)
          // displayResponseBox.setMessage("A password recovery email was sent to your account.", false)
          antiForgeryToken.setAntiForgeryToken(res);
          $state.go('login')
        }

        self.resetPassword = function () {
          //TODO QUESTION use token to make request for user info, or pass the token
          // var data = { Username : "JUNK_USERNAME"}
          var data = null
          httpService.forgotPassword(self.forgotPasswordData)
            .then(self.resetPasswordSuccess, self.error)
        }

        self.checkCookie = function () {
          tokenStorageService.refreshCookie();
        };

        // tokenValidationService.checkTokenAndRedirect()
      self.populateAntiForgeryToken = function() {
          console.log("Antiforgery" + res);
          self.updateEmailData.AntiForgeryTokenId =  antiForgeryToken.getAntiForgeryToken();
          self.updateEmailData.SessionId = tokenStorageService.getToken();
          self.forgotPasswordData.AntiForgeryTokenId = antiForgeryToken.getAntiForgeryToken();
          self.forgotPasswordData.SessionId = tokenStorageService.getToken();
          self.checkCookie();
        }

      self.populateAntiForgeryToken();


    }]);
