angular.module('ssoApp')
.controller('havingTroubleCtrl', ['$http', 'httpService', 'Constants', 'displayResponseBox', '$state', 'getUrl', function ($http, httpService, Constants, displayResponseBox, $state, getUrl) {
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
  }

  self.forgotPassSuccess = function (res) {
    // console.log('havingTrouble.forgotPassSuccess res param', res)
    displayResponseBox.setMessage("A password recovery email was sent your account.", false)
    $state.go('login')
  }

  self.error = function (err) {
    // console.log('havingTrouble.error err param', err)
    var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
    displayResponseBox.populateResponseBox(self.responseBoxConfig, message, true)
  }

  self.populateAntiForgeryToken = function(res) {
    console.log("Antiforgery" + res);
    self.forgotPassData.AntiForgeryTokenId =  res.data
  }

  self.forgotPasswordRequest = function (event) {
    event.preventDefault()
    $('.processingBtn').button('loading');

    httpService.forgotPassword(self.forgotPassData)
      .then(self.forgotPassSuccess, self.error)
      .finally(function () { $('.processingBtn').button('reset'); })
  }

  self.showModal = function () {
    $('#havingTroubleModal').modal('show');
  }

  self.dismissToRecoverAccount = function () {

    $('#havingTroubleModal').on('hidden.bs.modal', function () {
      $state.go('recover-account')
    })
    $('#havingTroubleModal').modal('hide')
  }

  self.callSecurityTokens = function() {
          $http.get('https://mws.stage.kroll.com/api/v1/security/tokens')
    .then(self.populateAntiForgeryToken, self.error);
  }

  self.showModal()

  self.callSecurityTokens()



}])
