angular.module('ssoApp')

.controller('AccountActivationCtrl', ['loadBrandingService', '$http', 'Constants', '$state', '$window', 'httpService', 'displayResponseBox', 'tokenValidationService', 'tokenStorageService', function (loadBrandingService, $http, Constants, $state, $window, httpService, displayResponseBox, tokenValidationService, tokenStorageService){

  var self = this;

  self.data = {
    SSN : null,
    SessionId : null,
    Accept: false,
    AntiForgeryToken: null
  }

  self.confirmData = {
    SSN : null
  }

  self.regex = {
    ssn : Constants.regexs.ssn,
    confirmSsn : Constants.regexs.ssn
  }

  self.responseBoxConfig = {
    message : null,
    error : false,
    display : false
  }
  
  self.responseBoxConfig = displayResponseBox.checkMessage()


  self.error = function (err) {
    var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
    displayResponseBox.populateResponseBox(self.responseBoxConfig, message, true)
  }

  self.activationSuccess = function (res) {
    //TODO write redirect code ?
    // $window.location.assign(loadBrandingService._styles.pingURL + res.data.responseObject.pingToken)
    // $window.location.assign(Constants.portalBaseUrl + res.data.responseObject.pingToken);
    $window.location.assign(loadBrandingService._styles.pingURL + res.data.responseObject);
  }
  
  self.invalidTokenError = function(err) {
    console.log("Invalid TOken Error");
    var message = (!err.data.responseObject.isValid) ? err.data.responseObject.message : "There was an unexpected error.";

    displayResponseBox.setMessage(message, true)
        $state.go('login')
  }

  self.activationRequest = function (event) {
    event.preventDefault()
    httpService.firstTimeActivate(self.data)
      // .then(self.acitvationSuccess, self.error)
      .then(self.activationSuccess, self.incorrectError)
  }

  self.incorrectError = function (event) {
    console.log("Error");
  }

  self.populateId = function (res) {
    console.log("In success");
    self.data.SessionId = tokenValidationService.getToken();
    tokenStorageService.setToken(self.data.SessionId);
    // self.data.MemberId = res.data.responseObject.id
  }
  
  self.populateAntiForgeryToken = function(res) {
    console.log("Antiforgery" + res);
    
    self.data.AntiForgeryTokenId =  res.data
    // 
  }

  tokenValidationService.checkTokenAndRedirect()
    .then(self.populateId, self.invalidTokenError)
    
  $http.get('https://mws.stage.kroll.com/api/v1/security/tokens')
    .then(self.populateAntiForgeryToken, self.error);






}])
