"use strict"

angular.module('ssoApp')

.controller('recoverAccountCtrl', ['$scope', 'contentService','antiForgeryToken', '$http','httpService', 'Constants', 'displayResponseBox', '$state', 'usernameService','tokenStorageService', 'getUrl', function ($scope, contentService, antiForgeryToken, $http, httpService, Constants, displayResponseBox, $state, usernameService, tokenStorageService, getUrl) {
  // console.log("Inside Recover Account Controller")

  var self = this;

  self.recoveryData = {
    // Username: null,
    MembershipNumber: null,
    LastName: null,
    ZipCode: null,
    DateOfBirth: null,
    AntiForgeryTokenId: null,
    ClientUrl : getUrl()
  }

  self.interchangableComponents = null;

  self.usernameData = {
    Username : null,
    AntiForgeryTokenId: null,
    LoginSourceId : Constants.loginSourceId,
    SessionId : null,
    ClientUrl : getUrl()
  }

  self.regex = {
    // username : Constants.regexs.username,
    lastName : Constants.regexs.names,
    zip : Constants.regexs.zip,
    date : Constants.regexs.date
  }

  self.responseBoxConfig = {
    message : null,
    error : false,
    display : false
  }
  //date picker code
  self.kendoDateOptions = Constants.datePickerOptions

  //*************************************************
  // Showing Modal Function
  //*************************************************

  self.showJustUsernameModal = function () {
    $('#username-modal').modal('show')
  }

  self.showUsernameForceResetModal = function () {
    $('#username-force-reset-modal').modal('show')
  }

  //*************************************************
  // Redirecting to Username
  //*************************************************

  self.redirectUpdateEmail = function () {
    usernameService.storeUsername(self.usernameData.Username)
    $state.go('Update Email Address');
  }



  // self.showUpdateEmailModal = function () {
  //   //TODO
  // }

  //**************************************************
  // Generic modal request functions
  //**************************************************

  self.modalRequestError = function (err) {
    $('.recover-page-modal').modal('hide')
    self.error(err)
  }

  self.resetPass = function () {
    httpService.forgotPassword(self.usernameData)
      .then(self.resetPassSuccess, self.modalRequestError)
  }

  self.resetPassSuccess = function (res) {
    var message = res.data.responseObject
    displayResponseBox.setMessage(message, false)
    $state.go('Sign In');
  }

  //**************************************************
  // Redirecting to Login Functions
  //**************************************************

  self.backToLogin = function () {
    var modal =  $('.recover-page-modal')
    if (modal.length > 0) {
      self.backToLoginFromModal()
    } else {
      $state.go('Sign In')
    }
  }

  self.backToLoginFromModal = function (event) {
    $('.recover-page-modal').one('hidden.bs.modal', function () {
      $state.go('Sign In')
    })
    $('.recover-page-modal').modal('hide')
  }

  //Recover Account Functions
  //**********************************************
  //
  // self.redirectUpdateEmail = function (token) {
  //   $state.go('update-email', { token : token })
  // }

  // self.recoverSuccess = function (res) {
  //   // console.log('recoverSuccess response', res)
  //   tokenStorageService.setToken();
  //   self.usernameData.Username = res.data.responseObject.username
  //   self.usernameData.TokenId = res.data.responseObject.token
  //   // self.recoveryData.SessionId = tokenStorageService.setToken();

  //   if ('they need to update email') {
  //     //TODO figure out how we're going to do this, i feel like it should be a modal, but it's not currently
  //     self.redirectUpdateEmail()
  //     // self.showUpdateEmailModal(res)
  //   } else if ('they need to reset their password') {
  //     self.showUsernameForceResetModal()
  //   } else {
  //     self.showJustUsernameModal()
  //   }
  // }

  self.recoverSuccess = function (res) {
    // console.log('recoverSuccess response', res)
    tokenStorageService.setToken(res.data.responseObject.sessionToken);

    // self.usernameData.TokenId = res.data.responseObject.token
    // self.recoveryData.SessionId = tokenStorageService.setToken();

    if (res.data.responseObject.redirectEndpoint == 'forgot-username') {
      self.usernameData.Username = res.data.responseObject.username
      self.showUsernameForceResetModal()
      //TODO figure out how we're going to do this, i feel like it should be a modal, but it's not currently
    //   self.redirectUpdateEmail()
    //   // self.showUpdateEmailModal(res)
    // } else if ('they need to reset their password') {

    // } else {
    //   self.showJustUsernameModal()
     }

     if (res.data.responseObject.redirectEndpoint == 'account/update-email') {
      self.usernameData.Username = res.data.responseObject.username
      self.redirectUpdateEmail()
  }

  if (res.data.responseObject.redirectEndpoint == 'login') {
    self.usernameData.Username = res.data.responseObject.username
     self.showJustUsernameModal()
  }

  self.usernameData.SessionId = tokenStorageService.getToken();

  antiForgeryToken.setAntiForgeryToken(res);
  }

  self.error = function (err) {
    // console.log('recoverError error', err)
    var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
    displayResponseBox.populateResponseBox(self.responseBoxConfig, message, true);
    antiForgeryToken.setAntiForgeryTokenFromError(err);
  }

  self.requestRecovery = function (event) {
    event.preventDefault()
    $('.processingBtn').button('loading');

    httpService.recoverAccount(self.recoveryData)
      .then(self.recoverSuccess, self.error)
      .finally(function () { $('.processingBtn').button('reset'); })
  }

  self.populateAntiForgeryToken = function(res) {
            // console.log("Antiforgery" + res);
            self.recoveryData.AntiForgeryTokenId =  antiForgeryToken.getAntiForgeryToken();
            self.usernameData.AntiForgeryTokenId =  antiForgeryToken.getAntiForgeryToken();
            self.checkCookie();
          }

      self.checkCookie = function () {
        tokenStorageService.refreshCookie();
      };

      $scope.interchangableComponents = contentService._content;
      
      self.populateAntiForgeryToken();




}])
