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
  var checkValidation = function (element, model) {
    // console.log("checkingValidation model", model)
    if (model.$invalid) {
      // invalidHighlight(element)
      inputErrorService.determineError(element, model);

      if (document.getElementsByClassName("updateProcessingBtn")[0]) {
        document.getElementsByClassName("updateProcessingBtn")[0].setAttribute("disabled", "disabled");
      }
      
    } else if (model.$valid) {
      console.log('removing error')
      // validHighlight(element)
      inputErrorService.removeError(element)
      // document.getElementsByTagName("H1")[0].setAttribute("class", "democlass");
            if (document.getElementsByClassName("updateProcessingBtn")[0]) {
        document.getElementsByClassName("updateProcessingBtn")[0].removeAttribute("disabled", "disabled");
      }
            // document.getElementsByClassName("updateProcessingBtn")[0].removeAttribute("disabled", "disabled");

    } else {
      console.log('removing error')
      // validHighlight(element)
      inputErrorService.removeError(element)
            if (document.getElementsByClassName("updateProcessingBtn")[0]) {
        document.getElementsByClassName("updateProcessingBtn")[0].removeAttribute("disabled", "disabled");
      }
            // document.getElementsByClassName("updateProcessingBtn")[0].removeAttribute("disabled", "disabled");

      // document.getElementsByTagName("H1")[0].setAttribute("class", "democlass");
    }
  };

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

        debounce = $timeout(function () { checkValidation(angularInput, inputModel)}, 500);
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

      checkValidation(angularInput, inputModel);

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
