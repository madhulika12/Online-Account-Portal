'use strict';

angular.module('ssoApp')

    .controller('validationCtrl', ['$state', function($state) {
        // console.log("Inside Validation Controller");

        var self = this;

        self.username = angular.element(document.getElementsByClassName('input'));

        self.setRegularExpression = function () {
          if($state.is('update-email')) {
                self.re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
          } else {
               self.re = /^[a-zA-Z0-9]+$/;
          }
        };

        self.testInputValidity = function () {
          var closest = angular.element( angular.element(self.username[0]).closest('div') );

          if(!self.re.test(self.username[0].value)) {
              closest.removeClass("has-success");
              closest.addClass("has-error");
          } else {
              // console.log("Inside else");
              closest.removeClass("has-error");
              closest.addClass("has-success");
          }
        };

        self.setRegularExpression();

        angular.element(self.username).on("input", function () {
          self.testInputValidity();
        });
 }]);
