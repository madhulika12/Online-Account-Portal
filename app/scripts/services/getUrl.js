angular.module('ssoApp')
.service('getUrl', ['$location', function ($location) {
  return function () {
     var host = $location.host();
     return (host === 'localhost') ? $location.port() : host;
  }
}])
