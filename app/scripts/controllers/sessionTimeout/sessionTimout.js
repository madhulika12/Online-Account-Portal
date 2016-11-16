'use strict';

angular.module('ssoApp')
    .controller('sessionTimout', ['sessionService', 'httpService','displayResponseBox','$state','tokenStorageService', '$rootScope', 'loadBrandingService', '$http', '$scope', '$timeout', '$uibModal', '$location', function(sessionService, httpService, displayResponseBox, $state, tokenStorageService, $rootScope, loadBrandingService, $http, $scope, $timeout, $uibModal, $location) {
        console.log("Outside");

        var self = this;

        self.data = {
            SessionId : null,
            AntiForgeryTokenId: null
        }

        function test () {
            var showSomething = true;
        }

        self.showTimer = false;

        self.idleTime = 0;
        self.idleTime1 = true;

        self.extendCookieExpiry = function () {
          tokenStorageService.refreshCookie();
          httpService.extendTimeout(sessionService.data)
        };

        self.showModal = function () {
          tokenStorageService.refreshCookie();
        };



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

      }
      }

    self.backToLoginRoute = function() {
        console.log("In backtoLogin but outside event")
           $('#username-modal').modal('hide')
           $('.modal-backdrop').removeClass("modal-backdrop");
              $('body').removeClass('modal-open');
              $('.modal-backdrop').remove();
                displayResponseBox.setMessage("Your session has ended. To continue you must log back into the system with your current credentials.", true);
                $state.go('login')
            }


      function timerIncrement() {
          self.idleTime = self.idleTime + 1;
          if (self.idleTime > 15) { // 20 minutes
              console.log($location.path());

              if($location.path() == '/login') {
                window.location.reload(true);
              }

              self.backToLoginRoute()
          } else if (self.idleTime > 13) {
              console.log("else of timerincrement " + self.idleTime)
                  $timeout(function () {
                        self.showTimer = true;
                        $('#session-modal').modal('show')
                    }, 10);
          }
      }


      self.checkCookie = function () {
        tokenStorageService.refreshCookie();
      };

      self.checkCookie();
    }]);
