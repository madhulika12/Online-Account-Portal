angular.module('ssoApp')
.service('tokenStorageService', ['$cookies', 'Constants', function ($cookies, Constants) {
  //I created this as a service to manage cookies, but if we're using http only cookies then we can't touch them from  the Javascript at all.
  var self = this
  var options = {}

  var optionsFifteen = function () {
    var opt = angular.copy(options)
    var fifteenAhead = self.now() + Constants.fifteenMinutes
    opt.expires = new Date(fifteenAhead)
    return opt
  }

  self.now = function () {
    return Date.now()
  }

  self.refreshCookie = function () {
    var token = self.getToken()
    self.setToken(token)
  }

  self.setToken = function (token) {
    console.log("set token");
    var opt = optionsFifteen()
    // document.cookie = "myCookie=" + JSON.stringify({foo: 'bar', baz: 'poo'});
    // document.cookie = "Kroll=" + JSON.stringify({ssoSessionId: token});
    // document.cookie = "Kroll1=myvalue";
    // document.cookie = "myCookie1=foo='bar'&baz='poo'";
    // document.cookie = "Kroll2=ssoSessionId="+token;
    $cookies.put(Constants.tokenCookieKey, token, optionsFifteen());
    self.startTimer();
  }

  self.startTimer = function() {
    // setInterval('self.showPopup()', 3000)
  }

  self.showPopup = function() {
    // console.log("Show popup")
  }

  self.getToken = function () {
    return $cookies.get(Constants.tokenCookieKey)
  }

  self.deleteToken = function () {
    $cookies.remove(Constants.tokenCookieKey)
  }
}])
