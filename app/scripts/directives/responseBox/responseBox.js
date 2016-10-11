"use strict";

/************************************************************

Format For Implementation:


  View:

  <response-box config="{{controllerName.whatever}}"></response-box>

  Controller:

  vm.whatever = {
    message : "This is an error, or a response message"
    error : [true/false]
  }

  message - [STRING] the message you want to display
  error - [BOOLEAN] if true it will be a red box, if falsey it will be a green box


****************************************************************/

angular.module('ssoApp')

.directive('responseBox', function () {

  var linkFxn = function (scope, element, attrs) {
    //currently doing nothing
  }

  return {
    restrict: 'E',
    scope: {
      config : '=',
      //TODO I'm not sure if these other three are necessary:
      error : '=',
      message : '=',
      display : '='
    },
    templateUrl: 'scripts/directives/responseBox/responseBox.html',
    link: linkFxn
  }


})
