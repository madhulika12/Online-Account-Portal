angular.module('ssoApp')
.controller('forgotUsernameCtrl', ['$http', 'Constants', '$state', 'httpService', 'displayResponseBox', function ($http, Constants, $state, httpService, displayResponseBox) {
  var self = this;

  self.recoveryData = {
    MembershipNumber: null,
    AntiForgeryTokenId: null,
    LastName: null,
    ZipCode: null,
    DateOfBirth: null
  }

  self.regex = {
    username : Constants.regexs.username,
    lastName : Constants.regexs.names,
    zip : Constants.regexs.zip,
    date : Constants.regexs.date
  }

  self.data = {
    Username : null,
    LoginSourceId : Constants.loginSourceId,
    AntiForgeryTokenId: null
  }

  self.responseBoxConfig = {
    message : null,
    error : false,
    display : false
  }

  //date picker code

  self.kendoDateOptions = Constants.datePickerOptions

  //*************************************************

  // Modal Related Function
  //*************************************************

  self.showUsernameModal = function () {
    $('#username-modal').modal('show')
  }

  self.backToLogin = function () {
    $('#username-modal').modal('hide')
    
    $('#username-modal').on('hidden.bs.modal', function () {
      $state.go('login')
    })
  }

  self.backToLoginAfterResetPassword = function (success) { 
    $('#username-modal').modal('hide')

    // $('#username-modal').on('hidden.bs.modal', function () {
      self.resetPasswordMessage(success);
      $state.go('login')
    // })
  }

  self.resetPasswordMessage = function(success) {
    var message = (success.data && success.data.responseObject) ? success.data.responseObject : "There was an unexpected error.";
    displayResponseBox.setMessage(message, false)
  }

  self.resetPassError = function (err) {
    $('#username-modal').modal('hide')
    self.error(err)
  }

  self.resetPass = function () {
    httpService.forgotPassword(self.data)
      .then(self.backToLoginAfterResetPassword, self.resetPassError)
  }

  //*********************************************

  self.error = function (err) {
    var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
    displayResponseBox.setMessage(message, true)
    $state.go('login')
  }

  self.forgotUserSuccess = function (res) {
    self.data.Username = res.data.responseObject.username;
    self.showUsernameModal()
  }

  self.sendForgotUsernameRequest = function (event) {
    event.preventDefault()
    $('.processingBtn').button('loading');
    httpService.recoverAccount(self.recoveryData)
      .then(self.forgotUserSuccess, self.error)
      .finally(function () { $('.processingBtn').button('reset'); })
  }

  self.populateAntiForgeryToken = function(res) {
    console.log("Antiforgery" + res);
    self.recoveryData.AntiForgeryTokenId =  res.data
    self.data.AntiForgeryTokenId =  res.data
  }

  $http.get('https://mws.stage.kroll.com/api/v1/security/tokens')
    .then(self.populateAntiForgeryToken, self.error);
}])