angular.module('ssoApp')
.service('getClient', ['$location', function ($location) {
  return function () {
     var host = $location.host();
    //  host = 'idshieldstage.mysecuredashboard.com'
    //  console.log(host);

     var regex = /idshield/;
    //  var regexMatch = host.match(regex);
     var regexTest = regex.test(host);

    //  console.log(regexTest);

    // var regexMatch = true;

    //  console.info("regexmatch");
    //  console.log(regexMatch);

    //  var host = $location.absUrl();
    //  return (host === 'localhost') ? $location.port() : host;

    if(regexTest) {
        var idshieldLink = 'https://imc2-staging2.csid.com/login?RTN=90000013'; 
        // console.log(idshieldLink);
        return idshieldLink;
    } else {
        var primericaLink = 'https://imc2-staging2.csid.com/login?RTN=90000151'; 
        // console.log(primericaLink);
        return primericaLink;
    }
    // return regexTest ? 'https://imc2-staging2.csid.com/login?RTN=90000013' : 'https://imc2-staging2.csid.com/login?RTN=90000151';

    // return host;

  }
}])