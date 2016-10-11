angular.module('ssoApp')

.service('usernameService', [function () {
  var username = null;

  var self = this;

  self.storeUsername = function (name) {
    username = name;
  }

  self.wipeUsername = function () {
    username = null;
  }

  self.getUsername = function () {
    var user = username
    self.wipeUsername()
    return user
  }

}])
