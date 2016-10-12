angular.module('ssoApp')

// SPECIAL

.controller('updateProfile', ['httpService', '$http', '$scope', 'Constants', 'tokenValidationService', 'tokenStorageService', 'displayResponseBox', function (httpService, $http, $scope, Constants, tokenValidationService, tokenStorageService, displayResponseBox) {

  var self = this

  self.mode = 'view';

  self.editPasswordMode = 'show';

  self.states = Constants.states
  self.generations = Constants.generations
  self.kendoDateOptions = Constants.datePickerOptions

  self.regex = {
    Password : Constants.regexs.password,
    FirstName : Constants.regexs.names,
    LastName : Constants.regexs.names,
    MailingAddress : Constants.regexs.address,
    City : Constants.regexs.city,
    ZipCode : Constants.regexs.zip,
    DateOfBirth : Constants.regexs.date,
    Email : Constants.regexs.email,
    PhoneNumber : Constants.regexs.phone
  }

  self.currentData = {
    FirstName : null,
    LastName : null,
    Generation : null,
    MailingAddress : null,
    City : null,
    State : null,
    ZipCode : null,
    DateOfBirth : null,
    Email : null,
    AntiForgeryTokenId: null,
    SessionId : null,
    PhoneNumber: null
  }

  self.updatedData = {}

  self.resetPassData = {
    LoginSourceId : Constants.loginSourceId,
    CurrentPassword : null,
    NewPassword : null,
    AntiForgeryTokenId: null,
    SessionId : null
  }

  self.confirmData = {
    Password : null
  }

  self.saveResponseBox = {
    message : null,
    error : false,
    display : false
  }
  self.resetPassResponseBox = {
    message : null,
    error : false,
    display : false
  }

  //xxxxxx
  // PRESERVING OLD DATA
  //xxxxxx


        self.dataToPopulateForm = {
          AntiForgeryTokenId: null,
          SessionId : null
        }


  self.setData = function (res) {
    var db = res.data.responseObject
    if (res.data.responseObject) {
      self.currentData = {
        FirstName : db.firstName,
        LastName : db.lastName,
        Generation : db.suffix,
        MailingAddress : db.address1,
        City : db.city,
        State : db.stateProvince,
        ZipCode : db.postalCode,
        DateOfBirth : db.dob,
        Email : db.email,
        PhoneNumber : db.homePhone,
        SessionId : tokenStorageService.getToken(),
        AntiForgeryTokenId :  self.updatedData.AntiForgeryTokenId
      }
      self.setUpdatedDataAsOld()
    }
  }

  self.setUpdatedDataAsOld = function () {
    angular.copy(self.currentData, self.updatedData)
  }

  self.editOn = function () {
    self.mode = 'edit'
  }

  self.passwordMode = function () {
    self.editPasswordMode = 'change'
  }

  self.cancel = function () {
    self.setUpdatedDataAsOld()
    self.mode = 'view'
  }

  self.cancelPassword = function () {
    // self.setUpdatedDataAsOld()
    self.editPasswordMode = 'show'
  }

  //xxxxxx
  // Request/Response Functions
  //xxxxxx

  self.saveError = function (err) {
    var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error - Update Profile.";
    displayResponseBox.populateResponseBox(self.saveResponseBox, message, true)
  }

  self.saveSuccess = function (res) {
    displayResponseBox.populateResponseBox(self.saveResponseBox, "Your information was successfully updated!", false)
  }

  self.save = function () {
    $('.updateProcessingBtn').button('loading');
    httpService.updateProfile(self.currentData)
      .then(self.saveSuccess, self.saveError)
      .finally(function () { $('.updateProcessingBtn').button('reset'); })
  }

  //xxxxxx
  // RESET PASSWORD FORM
  //xxxxxx

  self.setPassError = function (err) {
    var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
    displayResponseBox.populateResponseBox(self.resetPassResponseBox, message, true)
  }


  self.setPassSuccess = function (res) {
    displayResponseBox.populateResponseBox(self.resetPassResponseBox, "Your information was successfully updated!", false)
  }

  self.setNewPassword = function () {
    $('.resetPassProcessingBtn').button('loading');
    httpService.changePassword(self.resetPassData)
      .then(self.setPassSuccess, self.setPassError)
      .finally(function () { $('.resetPassProcessingBtn').button('reset'); })
  }

  //RUNNING FUNCTIONS ON INSTANTIATION
  // tokenValidationService.checkTokenAndRedirect()
  //   .then(self.setData, null)

      self.setViewAndRender = function (modelCtrl, data) {
          modelCtrl.$setViewValue(data)
          modelCtrl.$render()
          modelCtrl.$validate()
        }

   self.populateForm = function (res) {
          if (res && res.data && res.data.responseObject) {
            var db = res.data.responseObject

            // self.data.MemberId = db.id
            self.setViewAndRender(self.form.DateOfBirth, db.dob)
            self.setViewAndRender(self.form.PhoneNumber, db.homePhone)
            self.setViewAndRender(self.form.FirstName, db.firstName)
            self.setViewAndRender(self.form.LastName, db.lastName)
            self.setViewAndRender(self.form.Generation , db.suffix)
            self.setViewAndRender(self.form.MailingAddress, db.address1)
            self.setViewAndRender(self.form.City, db.city)
            self.setViewAndRender(self.form.State, db.stateProvince)
            self.setViewAndRender(self.form.ZipCode, db.postalCode)
            self.setViewAndRender(self.form.Email, db.email);

            self.updatedData.DateOfBirth = db.dob;
            self.updatedData.PhoneNumber = db.homePhone
            self.updatedData.FirstName=db.firstName
            self.updatedData.LastName=db.lastName
            self.updatedData.Generation=db.suffix
            self.updatedData.MailingAddress=db.address1
            self.updatedData.City=db.city
            self.updatedData.State=db.stateProvince
            self.updatedData.ZipCode=db.postalCode
            self.updatedData.Email=db.email;
          }
        }

  
  self.populateAntiForgeryToken = function(res) {
    console.log("Antiforgery" + res);
    // self.dataToPopulateForm.SessionId = tokenStorageService.getToken()
    self.dataToPopulateForm.SessionId = tokenStorageService.getToken()
    self.dataToPopulateForm.AntiForgeryTokenId =  res.data
    self.updatedData.SessionId = tokenStorageService.getToken()
    self.updatedData.AntiForgeryTokenId =  res.data
    self.resetPassData.SessionId = tokenStorageService.getToken()
    self.resetPassData.AntiForgeryTokenId =  res.data
    self.sendRequestToPopulate();
  }

  self.sendRequestToPopulate = function() {
          httpService.getMember(self.dataToPopulateForm)
            // .then(self.populateForm, self.error)
            .then(self.setData, self.error)
        }
  
        //  self.delCookie = function() {
        //   var ssoSessionId = tokenStorageService.getToken();
        //   httpService.delCookie(self.resetPassData.SessionId)
        //     .then(self.success, self.error)
        // }; 

  $http.get('https://mws.stage.kroll.com/api/v1/security/tokens')
    .then(self.populateAntiForgeryToken, self.error);

      //  window.onbeforeunload = self.delCookie();

      //  $(window).on('mouseover', (function () {
      //     window.onbeforeunload = null;
      // }));
      // $(window).on('mouseout', (function () {
      //     console.log("leaving");
       

}])
