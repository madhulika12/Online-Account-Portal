angular.module('ssoApp')
.service('afterSessionExpire', ['$location', 'Constants', function ($location, Constants) {


    return console.log("In afterSessionExpire");

}])
