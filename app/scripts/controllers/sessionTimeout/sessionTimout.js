'use strict';

angular.module('ssoApp')
    .controller('sessionTimout', ['$rootScope', 'loadBrandingService', '$http', '$scope', '$timeout', function($rootScope, loadBrandingService, $http, $scope, $timeout) {
        console.log("Outside");

        var self = this;
        self.showTimer = false;

        self.idleTime = 0;
        self.idleTime1 = true; 

        $(document).ready(function () {
          //Increment the idle time counter every minute.
          var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

          //Zero the idle timer on mouse movement.
          $(this).mousemove(function (e) {
              self.idleTime = 0;
          });
          $(this).keypress(function (e) {
              self.idleTime = 0;
          });
      });

      function timerIncrement() {
          self.idleTime = self.idleTime + 1;
          if (self.idleTime > 15) { // 20 minutes
              window.location.assign('https://idshieldstage.krollportal.com/login');
          } else if (self.idleTime > 1) {
              console.log(self.idleTime)
                  $timeout(function () {
                        self.showTimer = true;
                        $('#session-modal').modal('show')
                    }, 500);
              
          }
      }
    }])
