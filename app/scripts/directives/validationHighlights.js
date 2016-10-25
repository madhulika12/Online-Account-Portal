"use strict";
/*****************************************

Format For Implementation:

<form name="ctrlName.form" validation-highlights>
  <div>
    <input class="input" ng-model="ctrlName.whatever" ng-pattern="someRegex" name="someName" />
  </div>
  <div>
    <input class="input" ng-model="ctrlName.whatever2" ng-pattern="someRegex2" name="someName2" />
  </div>
</form>

Form needs:
  - a name, (making it ctrlName.form places it on the controller as well)
  - validation-highlights

Each Input Needs:
  - To be wrapped in it's own div
  - The class "input"
  - ng-model
  - ng-pattern
  - name

******************************************/

angular.module('ssoApp')

.directive('validationHighlights', function ($timeout, Constants, $compile, inputErrorService) {

  //checks the validity of the input element's data. Applies highlights accordingly
  var checkValidation = function (element, model, formCtrl) {
    // console.log("checkingValidation model", model)
    if (model.$invalid) {
      // invalidHighlight(element)
      // var name = model.$name
      inputErrorService.determineError(element, model);

      if (document.getElementsByClassName("updateProcessingBtn")[0]) {
        document.getElementsByClassName("updateProcessingBtn")[0].setAttribute("disabled", "disabled");
      }
      
    // console.log(formCtrl.$$success.required[0].$valid);
    } else if (model.$valid) {
      console.log('removing error')
      // validHighlight(element)
      inputErrorService.removeError(element)
      // document.getElementsByTagName("H1")[0].setAttribute("class", "democlass");
      var validVal = 0
      if(formCtrl.$$success.required && formCtrl.$$success.required.length == 9) {

      for(var i = 0; i < formCtrl.$$success.required.length; i = i + 1) {

         console.log("i " + i );
         console.log(formCtrl.$$success.required[i].$name);
         console.log(formCtrl.$$success.required[i].$valid);

        if(formCtrl.$$success.required[i].$valid) {
          validVal = validVal + 1;

          console.log(formCtrl.$$success.required.length);

          if (validVal == formCtrl.$$success.required.length-1) {
            if (document.getElementsByClassName("updateProcessingBtn")[0]) {
            document.getElementsByClassName("updateProcessingBtn")[0].removeAttribute("disabled", "disabled");
          }
          } 
          
        }
      }
    }
    }

      // if(formCtrl.$$success.required) {
      //         // if (formCtrl.$$success.required.length == 9 && formCtrl.$$success.required[0].$valid && formCtrl.$$success.required[1].$valid && formCtrl.$$success.required[2].$valid && formCtrl.$$success.required[3].$valid && formCtrl.$$success.required[4].$valid && formCtrl.$$success.required[5].$valid && formCtrl.$$success.required[7].$valid && formCtrl.$$success.required[8].$valid && formCtrl.$$success.required[9].$valid)  {
      //           if (formCtrl.$$success.required.length == 9 && formCtrl.$$success.required[0].$valid && formCtrl.$$success.required[1].$valid && formCtrl.$$success.required[2].$valid && formCtrl.$$success.required[3].$valid && formCtrl.$$success.required[4].$valid)  {
      //   if (document.getElementsByClassName("updateProcessingBtn")[0]) {
      //       document.getElementsByClassName("updateProcessingBtn")[0].removeAttribute("disabled", "disabled");
      //     } 
      // } else {
      //           if (document.getElementsByClassName("updateProcessingBtn")[0]) {
      //       document.getElementsByClassName("updateProcessingBtn")[0].setAttribute("disabled", "disabled");
      //     } 
      // }
      // }
 
      // }


            
            // document.getElementsByClassName("updateProcessingBtn")[0].removeAttribute("disabled", "disabled");

    // } else {
    // console.log('removing error')
    //   // validHighlight(element)
    //   inputErrorService.removeError(element)
    //   // document.getElementsByTagName("H1")[0].setAttribute("class", "democlass");
    //   var validVal = 0
    //   for(var i = 0; i < formCtrl.$$success.required.length; i = i + 1) {
    //     if(formCtrl.$$success.required[i].$valid) {
    //       validVal = validVal + 1;

    //       if (validVal == success.required.length-1) {
    //         if (document.getElementsByClassName("updateProcessingBtn")[0]) {
    //         document.getElementsByClassName("updateProcessingBtn")[0].removeAttribute("disabled", "disabled");
    //       }
    //       } 
          
    //     }
    // }
    }

  var changeListenerWithDebounce = function (formCtrl) {
    var debounce = null
    // console.log('changeListenerWithDebounce')

    return function () {
        var angularInput = angular.element(this);
        var inputModel = formCtrl[this.name];

        if (debounce) {
          $timeout.cancel(debounce);
          debounce = null;
        }

        debounce = $timeout(function () { checkValidation(angularInput, inputModel, formCtrl)}, 500);
    }
  }

  //places a listener for the 'input' event on an element. When that listener fires it runs checkValidation on that element and the piece of the form data that that element represents.
  var registerInputListener = function (element, formCtrl) {

    angular.element(element).on('change input', changeListenerWithDebounce(formCtrl))

    angular.element(element).on('blur', function () {

      //actual dom element
      var angularInput = angular.element(this);
      //ngModel controller for that particular element.
      var inputModel = formCtrl[this.name];

      checkValidation(angularInput, inputModel, formCtrl) ;

    });
  };

  return {
    restrict: 'A',
    require: '^form', // places the whole form as the fourth parameter in the link function below.
    link: function (scope, element, attrs, form) {
        // console.log('validationHighlights.link form.controls', form)

        var inputs = angular.element(element).find('.input');
        inputs.each(function (index, input) {
          //the check below for "SPAN" is required because of the KendoDatePicker, which wraps the input with a span that has all the classes of the input (including the '.input' class). We're putting this event listener on everything with the class '.input'. The 'input' event bubbles up to that span and fires the 'input' event listener.
          if (input.tagName !== "SPAN") {
            registerInputListener(input, form);
          }
        });

    }
  };
});
