angular.module('ssoApp')
.service('getUrl', ['$location', function ($location) {
  return function () {
    //  var host = $location.host();
     var host = $location.absUrl();
    //  return (host === 'localhost') ? $location.port() : host;
    // return (host === 'localhost') ? 'https://idtheftdefensecharlie.mysecuredashboard.com' : host;

    return host;

  }
}])
