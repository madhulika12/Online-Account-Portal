angular.module('ssoApp')
.directive('asyncValidate', ['httpService', 'Constants', '$q', '$timeout', function (httpService, Constants, $q, $timeout) {



  var link = function (scope, elem, attrs, ctrl) {

      elem3 = scope.$parent.update.elemVal;
      
      console.log('asyncvalidators.link ctrl:', ctrl)
      ctrl.$asyncValidators.availability = function (modelValue, viewValue) {
      
      var inputCtrlVal = ctrl.$modelValue;
      var inputCtrlVal1 = inputCtrlVal;
      console.log('async validating')
      var deferred = $q.defer()

      var resolve = function (res) {
        console.log('existance based sucesss', res)
        console.log(ctrl);
        deferred.resolve(res)
      }

      var reject = function (err) {
        console.log('existance based rejection', err)
        deferred.reject(err)
      }

      if(ctrl.$dirty == true && elem3 != ctrl.$viewValue) {
        // console.log("InputVal " + inputVal);
        console.log("InputCtrlVal " + inputCtrlVal);
        httpService[ attrs['asyncValidate'] ](viewValue)
          .then(resolve, reject)
      }


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
