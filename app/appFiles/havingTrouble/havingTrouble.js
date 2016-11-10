angular.module('ssoApp')
.controller('havingTroubleCtrl', ['antiForgeryToken' ,'tokenStorageService', '$http', 'httpService', 'Constants', 'displayResponseBox', '$state', 'getUrl', function (antiForgeryToken, tokenStorageService, $http, httpService, Constants, displayResponseBox, $state, getUrl) {
  var self = this;

  self.forgotPassData = {
    Username : null,
    LoginSourceId : Constants.loginSourceId,
    AntiForgeryTokenId: null
  }

  self.forgotPassConfirmData = {
    Username : null
  }

  self.regex = {
    username : Constants.regexs.username
  }

  self.responseBoxConfig = {
    message : null,
    error : false,
    display : false
  };

  self.forgotPassSuccess = function (res) {
    // console.log('havingTrouble.forgotPassSuccess res param', res)
    var message = (res.data && res.data.responseObject) ? res.data.responseObject : "A password recovery email was sent to your account.";
    displayResponseBox.setMessage(message, false);
    $state.go('login');
    antiForgeryToken.setAntiForgeryToken(res);
  };

  self.error = function (err) {
    // console.log('havingTrouble.error err param', err)
    var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
    displayResponseBox.populateResponseBox(self.responseBoxConfig, message, true);
  };

  self.populateAntiForgeryToken = function(res) {
    console.log("Antiforgery" + res);
    self.forgotPassData.AntiForgeryTokenId =  antiForgeryToken.getAntiForgeryToken();
  };

  self.forgotPasswordRequest = function (event) {
    event.preventDefault();
    $('.processingBtn').button('loading');

    httpService.forgotPassword(self.forgotPassData)
      .then(self.forgotPassSuccess, self.error)
      .finally(function () { $('.processingBtn').button('reset'); });
  };

  self.showModal = function () {
    $('#havingTroubleModal').modal('show');
  };

  self.dismissToRecoverAccount = function () {

    $('#havingTroubleModal').one('hidden.bs.modal', function () {
      $state.go('recover-account');
    });
    $('#havingTroubleModal').modal('hide');
  };

  self.callSecurityTokens = function() {
          $http.get('https://mws.stage.kroll.com/api/v1/security/tokens')
    .then(self.populateAntiForgeryToken, self.error);
    self.checkCookie();
  }
  
  self.checkCookie = function () {
    tokenStorageService.refreshCookie();
  }

  self.showModal()

  self.populateAntiForgeryToken()



}])
