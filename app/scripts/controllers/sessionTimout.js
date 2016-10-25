'use strict';

angular.module('ssoApp')
    .controller('sessionTimout', ['$rootScope', 'loadBrandingService', '$http', '$scope', function($rootScope, loadBrandingService, $http, $scope) {
        console.log("Outside");

        var self = this;

        self.idleTime = 0;
        self.showTimer = false;

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
          } else if (self.idleTime > 12) {
              self.showTimer = true;
          }
      }
    }])
