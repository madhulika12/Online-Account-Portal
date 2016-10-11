angular.module('ssoApp')
.controller('termsAcceptanceCtrl', ['Constants', 'tokenValidationService', 'httpService', 'displayResponseBox', '$window', 'tokenStorageService', '$http', function(Constants, tokenValidationService, httpService, displayResponseBox, $window, tokenStorageService, $http){

  var self = this;

  self.data = {
    LoginSourceId: 2,
    AntiForgeryTokenId: null,
    sessionId: tokenStorageService.getToken()
  }

  self.TermsAccept = null;

  self.responseBoxConfig = {
    message : null,
    error : false,
    display : false
  }

  self.success = function (res) {
    $window.location.assign(Constants.portalBaseUrl + res.data.responseObject.pingToken);
  }

  self.error = function (err) {
    var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
    displayResponseBox.populateResponseBox(self.responseBoxConfig, message, true)
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
    self.data.AntiForgeryTokenId =  res.data
  }
  
  $http.get('https://mws.stage.kroll.com/api/v1/security/tokens')
    .then(self.populateAntiForgeryToken, self.error);
  
}])
