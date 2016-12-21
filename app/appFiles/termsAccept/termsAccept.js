angular.module('ssoApp')
.controller('termsAcceptanceCtrl', ['antiForgeryToken', 'Constants', 'tokenValidationService', 'httpService', 'displayResponseBox', '$window', 'tokenStorageService', '$http', 'getUrl', function(antiForgeryToken, Constants, tokenValidationService, httpService, displayResponseBox, $window, tokenStorageService, $http, getUrl){

  var self = this;

  self.data = {
    LoginSourceId: 2,
    AntiForgeryTokenId: null,
    sessionId: tokenStorageService.getToken(),
    ClientUrl: getUrl()
  }

  self.TermsAccept = null;

  self.responseBoxConfig = {
    message : null,
    error : false,
    display : false
  }

  self.success = function (res) {
    antiForgeryToken.setAntiForgeryToken(res);
    $window.location.assign(Constants.portalBaseUrl + res.data.responseObject.pingToken);
  }

  self.error = function (err) {
    var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
    displayResponseBox.populateResponseBox(self.responseBoxConfig, message, true);
    antiForgeryToken.setAntiForgeryTokenFromError(err);
  }

  self.acceptTerms = function (event) {
    event.preventDefault()
    $('.processingBtn').button('loading');
    console.log("acceptTerms" + self.data);
    httpService.acceptTerms(self.data)
      .then(self.success, self.error)
      .finally(function () { $('.processingBtn').button('reset'); })
  }

  self.populateId = function (res) {
    // console.log('populateid', res)
    self.data.MemberId = res.data.responseObject.id
  }

  // tokenValidationService.checkTokenAndRedirect()
  //   .then(self.populateId)
  
  self.populateAntiForgeryToken = function(res) {
    console.log("Antiforgery" + res);
    self.data.AntiForgeryTokenId =  antiForgeryToken.getAntiForgeryToken();
      
    self.checkCookie();
  }
  
      self.checkCookie = function () {
        tokenStorageService.refreshCookie();
      };
  

    self.populateAntiForgeryToken();
  
}])
