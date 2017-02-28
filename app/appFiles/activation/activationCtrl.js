//THIS PAGE IS NOT CURRENTLY BEING USED




//!!!!!!! This page is not currently being used





//////////////

angular.module('ssoApp')

.controller('ActivationCtrl', ['getUrl', 'Constants', '$state', '$window', 'httpService', function (getUrl, Constants, $state, $window, httpService){

  var self = this;

  self.data = {
    membershipNum : null,
    lastName : null,
    zip : null,
    ClientUrl : getUrl()
  }

  self.regex = {
    lastName : Constants.regexs.names,
    zip : Constants.regexs.zip
  }


  self.error = function () {
  }
  self.activationSuccess = function (res) {
    // $window.location.href = '???'
  }

  self.activationRequest = function (event) {
    event.preventDefault()
    httpService.activate(self.data)
      .then(self.activationSuccess, self.error)
  }
}])
