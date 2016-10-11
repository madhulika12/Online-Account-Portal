"use strict";

/************************************************************

Format For Implementation: (CURRENTLY DOES NOT WORK WITH SELECT BOXES)

<div>
  <input />
  <input  />
</div>

-Both directive tags need to be on an element wrapping 2 inputs:

input-linker
  - can equal "match" or "link"
  - match: means that the two inputs need to have the exact same value (like password and password confirmation inputs)
  - link: means that if the left input is filled in the right input must also be filled in to be valid. But it doesn't have to have the same value.

bad-link-text
  - this is the red warning text you want to show the user when they fail to match inputs or fill out both inputs. Examples: "Both passwords must be the same.", "You need fill out the answer box if you select a security question"

****************************************************************/

angular.module('ssoApp')

.directive('inputLinker', function (inputErrorService) {

  var linkFxn = function (scope, element, attrs, form) {

    //fires a fake input event on the second input box when an input or change is fired on the first box. This makes sure the highlighting and the error messaging from the validation-highlights directive gets added. Because that only gets added after input events. This is a little clunky, as it makes the two directives slightly interdependent.
    var pairValidation = function () {
      $(first).on('input change blur', function () {
        secondModel.$validate();
        $(second).triggerHandler('input')
      })
    }

    var tooManyInputs = function () {
      throw "inputLinker directive is only meant to wrap two form elements. It looks like you have implemented it on a container with " + inputs.length + "."
    }

    // match - checks if the two inputs have the same value
    var match = function (modelValue, viewValue) {
      return (viewValue === firstModel.$viewValue) ? true : false;
    }

    //adds the match function as a validtor on the second input
    var setMatchValidator = function () {
      secondModel.$validators.matched = match
    }

    //setting some variables so that the rest of the directive can use them
    var inputs = $(element).find('.input');
    var formCtrl = form;

    if (inputs.length !== 2) {
      tooManyInputs()
    }

    //setting some variables so that the rest of the directive can use them
    var first = inputs[0]
    var second = inputs[1]
    var firstModel = formCtrl[first.name]
    var secondModel = formCtrl[second.name]

    setMatchValidator()
    pairValidation()

  }

  return {
    restrict: 'A',
    require: '^form',
    scope: {},
    link: linkFxn
  }


})
