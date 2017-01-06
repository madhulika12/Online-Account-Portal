angular.module('ssoApp')

// SPECIAL

.controller('updateProfile', ['antiForgeryToken', 'sessionService','inputErrorService', '$window', '$timeout', 'httpService', '$http', '$scope', 'Constants', 'tokenValidationService', 'tokenStorageService', 'displayResponseBox', 'getUrl', function (antiForgeryToken, sessionService, inputErrorService, $window, $timeout, httpService, $http, $scope, Constants, tokenValidationService, tokenStorageService, displayResponseBox, getUrl) {

  var self = this

  self.mode = 'view';
  self.editPasswordMode = 'show';
  self.elemVal = null;
  self.readOnlyProp = false;
  self.emailElem = null;

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

  }

  self.updatedData = {}

  self.resetPassData = {
    LoginSourceId : Constants.loginSourceId,
    CurrentPassword : null,
    NewPassword : null,
    AntiForgeryTokenId: null,
    SessionId : null,
    ClientUrl: getUrl()
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

  self.isEmailAvailableModel = {
          ClientUrl : getUrl(),
          EmailUserId: null,
          AntiForgeryTokenId: antiForgeryToken.getAntiForgeryToken(),
          SessionId: getUrl()
        }

  //xxxxxx
  // PRESERVING OLD DATA
  //xxxxxx


        self.dataToPopulateForm = {
          AntiForgeryTokenId: null,
          SessionId : null,
          ClientUrl: getUrl()
        }


  self.setData = function (res) {
    antiForgeryToken.setAntiForgeryToken(res);
    var db = res.data.responseObject
    var headers =  res.headers('XSRF-TOKEN');

    if (res.data.responseObject) {
      self.setReturnedData = {
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
        AntiForgeryTokenId :  self.updatedData.AntiForgeryTokenId,
        ClientUrl : getUrl()
      }
      self.setUpdatedDataAsOld()
      self.elemVal = db.email;

      self.checkCookie();
    }
  }

  self.setUpdatedDataAsOld = function () {
    angular.copy(self.setReturnedData, self.currentData)
    self.setReadOnly();
  }

       self.checkCookie = function () {
        tokenStorageService.refreshCookie();
      };

  self.setReadOnly = function() {
    if (self.setReturnedData.DateOfBirth) {
      self.readOnlyProp = true;
    }
  }

  self.editOn = function () {
    self.mode = 'edit'
  }

  self.goToDashboard = function() {
    $window.location.assign("http://imc2-staging2.csid.com/dashboard");
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

  self.appendDirectiveDom = function() {
  //     elem3 = $scope.update.elemVal;

  //     if(elem3 != document.getElementsByClassName('appendToDom')[0].value) {

  //       $http
  //         .get('https://mws.stage.kroll.com/api/v1/member/email-userid/exist?emailUserId=' + document.getElementsByClassName('appendToDom')[0].value)
  //           .then(function(res) {
  //             if(res.data.errorType == 200) {
  //               console.log("Success")
  //             } else {
  //               console.log("Error");
  //               inputErrorService.addAvailabilityError(document.getElementsByClassName('appendToDom'));
  //               // document.getElementsByClassName('appendToDom')[0].addClass("BorderColor")
  //             }
  //           }

  //           )
  // };
  }

  self.appendSuccess = function() {

  }

  self.appendError = function() {
    inputErrorService.addAvailabilityError();
  }

  self.saveError = function (err) {
    var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error - Update Profile.";
    displayResponseBox.populateResponseBox(self.saveResponseBox, message, true);
    antiForgeryToken.setAntiForgeryTokenFromError(err);
  }

  self.saveSuccess = function (res) {
    displayResponseBox.populateResponseBox(self.saveResponseBox, "Your information was successfully updated!", false)
    antiForgeryToken.setAntiForgeryToken(res);
  }

  self.save = function () {
    $('.updateProcessingBtn').button('loading');
    self.sendRequest()
    // $timeout(self.sendRequest(), 3000);
  }

  self.sendRequest = function() {
    httpService.updateProfile(self.currentData)
      .then(self.saveSuccess, self.saveError)
      .finally(function () { $('.updateProcessingBtn').button('reset'); })
  }


  //xxxxxx
  // RESET PASSWORD FORM
  //xxxxxx

  self.setPassError = function (err) {
    var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
    displayResponseBox.populateResponseBox(self.resetPassResponseBox, message, true);
    antiForgeryToken.setAntiForgeryTokenFromError(err);
  }


  self.setPassSuccess = function (res) {

    displayResponseBox.populateResponseBox(self.resetPassResponseBox, "Your information was successfully updated!", false)
    antiForgeryToken.setAntiForgeryToken(res);
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
          antiForgeryToken.setAntiForgeryToken(res);
        }


  self.populateAntiForgeryToken = function(res) {
    console.log("Antiforgery" + res);
    console.info("populateAntiForgeryToken");
    // console.dir(loadbrandingservice)
    
    // self.dataToPopulateForm.SessionId = tokenStorageService.getToken()
    self.dataToPopulateForm.SessionId = tokenStorageService.getToken()
    self.dataToPopulateForm.AntiForgeryTokenId = antiForgeryToken.getAntiForgeryToken();
    self.updatedData.SessionId = tokenStorageService.getToken()
    self.updatedData.AntiForgeryTokenId =  antiForgeryToken.getAntiForgeryToken();
    self.resetPassData.SessionId = tokenStorageService.getToken()
    self.resetPassData.AntiForgeryTokenId =  antiForgeryToken.getAntiForgeryToken();
    //
    // var a = sessionService.setTokenData()
    // sessionService.data.AntiForgeryTokenId =  res.data
    // sessionService.setTokenData.SessionId =  tokenStorageService.getToken()

    self.sendRequestToPopulate();
  }

  self.isEmailAvailable = function(userEmail) {
    self.isEmailAvailableModel.EmailUserId = userEmail;
    self.emailElem = this;

    if(userEmail !== undefined && userEmail != self.elemVal && !document.getElementById("email").classList.contains("ng-invalid-pattern")) {
      httpService.usernameExist(self.isEmailAvailableModel)
        // .then(self.emailAvailable, self.emailExists);
    }
  }

  self.emailExists = function() {
    console.log("Exists");

    // if (!document.getElementById("updateProfileSave").hasAttribute("disabled")) {
      document.getElementById("updateProfileSave").setAttribute("disabled", "disabled");
      document.getElementById("updateProfileSave").className += " EmailExists";
      document.getElementById("email").className += " ExistsError";
      inputErrorService.addAvailabilityError();
    // } 
    
  }

  self.emailAvailable = function() {
    console.log("Doesn't Exists");
    console.log(document.getElementById("updateProfileSave").classList.contains("EmailExists"));
    console.log(document.getElementById("updateProfileSave").hasAttribute("disabled"));

     document.getElementById("updateProfileSave").classList.remove("EmailExists");

    // if ((document.getElementById("updateProfileSave").classList.contains("EmailExists")) && (!document.getElementById("updateProfileSave").hasAttribute("disabled"))) {

      // if (document.getElementById("updateProfileSave").hasAttribute("disabled")) {
        if (document.getElementById("updateProfileSave").classList.contains("EmailExists")) {
          document.getElementById("updateProfileSave").removeAttribute("disabled", "disabled");
     
      //submitButton updateProcessingBtn k-button

    } 
    
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

    self.populateAntiForgeryToken();
}])
