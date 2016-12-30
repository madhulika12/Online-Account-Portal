angular.module('ssoApp')
.directive('asyncValidate', ['antiForgeryToken', 'httpService', 'Constants', '$q', '$timeout', 'getUrl', function (antiForgeryToken, httpService, Constants, $q, $timeout, getUrl) {



  var link = function (scope, elem, attrs, ctrl) {

      // console.log("scope");
      // console.dir(scope);
      // console.log("scope parent");
      // console.log(scope.$parent);
      // console.log("parent inside parent ");
      // console.log(scope.$parent.$parent);
      // console.log("update ");
      // console.log(scope.$parent.$parent.update );
      // console.log("elemVal ")
      // console.log(scope.$parent.$parent.update.elemVal);

      // var elem3;
      // elem3 = scope.$parent.$parent.update.elemVal;

      // console.log('asyncvalidators.link ctrl:', ctrl)



      ctrl.$asyncValidators.availability = function (modelValue, viewValue) {
      // if(elem3 != ctrl.$viewValue) {
        var data = {
          ClientUrl : getUrl(),
          EmailUserId: viewValue,
          AntiForgeryTokenId: antiForgeryToken.getAntiForgeryToken()
        }

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

      // if(ctrl.$dirty == true) {
      //   if(elem3 != ctrl.$viewValue) {
          console.log("InputCtrlVal " + inputCtrlVal);
          httpService[ attrs['asyncValidate'] ](data)
            .then(resolve, reject)
        //  }
      // }

      deferred.promise
        .finally(function () {
          //this needs to be in a timeout to delay it until after the digest cycle runs which switches the valiation status from pending to valid
          $timeout(function () { elem.triggerHandler('blur') })
        })

      return deferred.promise
    }
      }
    // console.log('asyncvalidators.link ctrl:', ctrl)
  // }

  return {
    restrict : 'A',
    require : 'ngModel',
    link : link
  }
}])
