angular.module('ssoApp')
.directive('asyncValidate', ['httpService', 'Constants', '$q', '$timeout', function (httpService, Constants, $q, $timeout) {



  var link = function (scope, elem, attrs, ctrl) {
      // console.log('asyncvalidators.link ctrl:', ctrl)
    ctrl.$asyncValidators.availability = function (modelValue, viewValue) {
      // console.log('async validating')
      var deferred = $q.defer()

      var resolve = function (res) {
        console.log('existance based sucesss', res)
        deferred.resolve(res)
      }

      var reject = function (err) {
        console.log('existance based rejection', err)
        deferred.reject(err)
      }

      httpService[ attrs['asyncValidate'] ](viewValue)
        .then(resolve, reject)

      deferred.promise
        .finally(function () {
          //this needs to be in a timeout to delay it until after the digest cycle runs which switches the valiation status from pending to valid
          $timeout(function () { elem.triggerHandler('blur') })
        })

      return deferred.promise
    }
    // console.log('asyncvalidators.link ctrl:', ctrl)
  }

  return {
    restrict : 'A',
    require : 'ngModel',
    link : link
  }
}])
