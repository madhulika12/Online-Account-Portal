angular.module('ssoApp')
.directive('emailExistDirective', ['$http','httpService', 'Constants', '$q', '$timeout', function ($http, httpService, Constants, $q, $timeout) {



  var link = function (scope, elem, attrs, ctrl) {

      console.log("Inside the link function of emailexistDirective" )
      console.log(scope);

      var elem3;

      elem3 = scope.$parent.update.elemVal;
      console.log("Elem3 outside asyncvalidators " + elem3 )

      ctrl.$asyncValidators.availability = function (modelValue, viewValue) {
          console.log("Elem3 inside asyncvalidators " + elem3 )

      var deferred = $q.defer()

      var resolve = function (res) {
            if(res.data.errorType == 200) {
                console.log("Success");
                deferred.resolve(res)
              } else {
                console.log("Error");
                deferred.reject(res)

      }
      }

      var reject = function (err) {
        deferred.reject(err)
      }

    if(elem3 != ctrl.$viewValue) {

    $http
          // .get('https://mws.stage.kroll.com/api/v1/member/email-userid/exist?emailUserId=' + ctrl.$viewValue)
          .get('https://auth-api.stage.kroll.com/api/v1/member/email-userid/exist?emailUserId=' + ctrl.$viewValue)
          .then(resolve, reject)
    }

      deferred.promise
        .finally(function () {
          //this needs to be in a timeout to delay it until after the digest cycle runs which switches the valiation status from pending to valid
          $timeout(function () { elem.triggerHandler('blur') })
        })

      return deferred.promise
    }
      }


  return {
    restrict : 'A',
    require : 'ngModel',
    link : link
  }
}])
