'use strict';

angular.module('ssoApp')
    .controller('sessionTimout', ['displayResponseBox','$state','tokenStorageService', '$rootScope', 'loadBrandingService', '$http', '$scope', '$timeout', function(displayResponseBox, $state, tokenStorageService, $rootScope, loadBrandingService, $http, $scope, $timeout) {
        console.log("Outside");

        var self = this;
        self.showTimer = false;

        self.idleTime = 0;
        self.idleTime1 = true; 

        $(document).ready(function () {
          //Increment the idle time counter every minute.
          var idleInterval = setInterval(timerIncrement, 60000); // 1 minute
          var checkCookie = setInterval(checkCookieExist, 60000); // 1 minute

          //Zero the idle timer on mouse movement.
          $(this).mousemove(function (e) {
              self.idleTime = 0;
          });
          $(this).keypress(function (e) {
              self.idleTime = 0;
          });
      });

      function checkCookieExist() {
          var cookieVal = tokenStorageService.getToken();
          if (!cookieVal) 
          {
              displayResponseBox.setMessage("Your session has ended. To continue you must log back into the system with your current credentials.", true);
              $state.go('login')
          }
      }

      function timerIncrement() {
          self.idleTime = self.idleTime + 1;
          if (self.idleTime > 14) { // 20 minutes
              $state.go('login')
          } else if (self.idleTime > 12) {
              console.log(self.idleTime)
                  $timeout(function () {
                        self.showTimer = true;
                        $('#session-modal').modal('show')
                    }, 500);
              
          }
      }
    }])
