angular.module('ssoApp')
.directive('emailExistDirective', ['$http','httpService', 'Constants', '$q', '$timeout', function ($http, httpService, Constants, $q, $timeout) {



  var link = function (scope, elem, attrs, ctrl) {
      elem3 = scope.$parent.update.elemVal;
      ctrl.$asyncValidators.availability = function (modelValue, viewValue) {
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
          .get('https://mws.stage.kroll.com/api/v1/member/email-userid/exist?emailUserId=' + ctrl.$viewValue)
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
