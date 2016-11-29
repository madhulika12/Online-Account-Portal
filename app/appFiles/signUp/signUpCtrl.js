'use strict';

angular.module('ssoApp')
    .controller('signUpCtrl', ['$http', '$location', 'Constants', '$rootScope', '$stateParams', 'httpService', 'tokenValidationService', 'displayResponseBox', '$window', 'tokenStorageService', '$state', 'loadBrandingService',function($http, $location, Constants, $rootScope, $stateParams, httpService, tokenValidationService, displayResponseBox, $window, tokenStorageService, $state, loadBrandingService) {
        var self = this;

        self.states = Constants.states
        self.generations = Constants.generations
        //date picker options
        self.kendoDateOptions = Constants.datePickerOptions

        self.data = {
          MemberId : null,
          FirstName : null,
          LastName : null,
          Generation : null,
          MailingAddress: null,
          City: null,
          State: null,
          Zip: null,
          Dob: null,
          Telephone: null,
          Username: null,
          Password: null,
          Ssn: null,
          TermsAccept: null,
          Email: null,
          AntiForgeryTokenId: null,
          SessionId : null
       }

        self.confirmationData = {
          Password: null,
          Ssn: null
        }

        self.regex = {
          FirstName : Constants.regexs.names,
          LastName : Constants.regexs.names,
          MailingAddress: Constants.regexs.address,
          City: Constants.regexs.city,
          ZipCode: Constants.regexs.zip,
          Dob: Constants.regexs.date,
          Telephone: Constants.regexs.phone,
          ConfirmSsn: Constants.regexs.ssn,
          Username: Constants.regexs.username,
          Email: Constants.regexs.email,
          Ssn: Constants.regexs.ssn,
          Password: Constants.regexs.password
        }

        self.responseBoxConfig = {
          message : null,
          error : true,
          display: false
        }

        self.dataToPopulateForm = {
          AntiForgeryTokenId: null,
          SessionId : null
        }

        //runs if the request has an http error
        self.error = function (err) {
          var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
          displayResponseBox.populateResponseBox(self.responseBoxConfig, message, true)
          // $('.processingBtn').button('reset');
        }

        self.invalidTokenError = function (err) {
          var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
          displayResponseBox.setMessage(message, true)
          $state.go('login')
          // $('.processingBtn').button('reset');
        }

        self.positiveSignUpRedirect = function (res) {
          // console.log(res.data.responseObject);
          // $window.location.assign(res.data.responseObject.pingToken);
          // $window.location.assign(Constants.portalBaseUrl + res.data.responseObject);
          // $('.processingBtn').button('reset');
          $window.location.assign(loadBrandingService._styles.pingURL + res.data.responseObject)
        }

        self.sendSignUpRequest = function(event) {
          event.preventDefault()
          $('.processingBtn').button('loading');
          httpService.signUp(self.data)
            .then(self.positiveSignUpRedirect, self.invalidTokenError)
            .finally(function () { $('.processingBtn').button('reset'); })
        };

        //Requests to autopopulate data in the form
        //**********************************************


        self.setViewAndRender = function (modelCtrl, data) {
          modelCtrl.$setViewValue(data)
          modelCtrl.$render()
          modelCtrl.$validate()
        }

        self.populateForm = function (res) {
          if (res && res.data && res.data.responseObject) {
            var db = res.data.responseObject

            self.data.MemberId = db.id
            self.setViewAndRender(self.form.Dob, db.dob)
            self.setViewAndRender(self.form.Phone, db.homePhone)
            self.setViewAndRender(self.form.FirstName, db.firstName)
            self.setViewAndRender(self.form.LastName, db.lastName)
            self.setViewAndRender(self.form.Generation , db.suffix)
            self.setViewAndRender(self.form.MailingAddress, db.address1)
            self.setViewAndRender(self.form.City, db.city)
            self.setViewAndRender(self.form.State, db.stateProvince)
            self.setViewAndRender(self.form.ZipCode, db.postalCode)
            self.setViewAndRender(self.form.Email, db.email);
          }
        }

        // tokenValidationService.checkTokenAndRedirect()
        //   .then(self.populateForm)

          self.populateAntiForgeryToken = function(res) {
            console.log("Antiforgery" + res);
            self.data.AntiForgeryTokenId =  res.data;
            self.dataToPopulateForm.AntiForgeryTokenId =  res.data;
            self.data.SessionId = tokenStorageService.getToken();
            self.dataToPopulateForm.SessionId = tokenStorageService.getToken()
            self.sendRequestToPopulate();
          }

      // $http.get('https://mws.stage.kroll.com/api/v1/security/tokens')
      //   .then(self.populateAntiForgeryToken, self.error);

        self.sendRequestToPopulate = function() {
          httpService.getMember(self.dataToPopulateForm)
            .then(self.populateForm, self.error)
        }

    //   console.log(document.getElementById("Email"))

    //    if(document.getElementById("Email").$valid) {
    // //     this.addAvailabilityError(elem)
    //   console.log("Valida");
    //  }

    }]);
