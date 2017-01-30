//SPECIAL
angular.module('ssoApp')
  .controller('loginCtrl', ['titleFactory', 'contentService','antiForgeryToken', '$scope', 'Constants', '$http', '$state', '$rootScope', 'httpService', 'displayResponseBox', '$window', '$location', 'tokenStorageService', 'loadBrandingService', 'getUrl', function(titleFactory, contentService, antiForgeryToken, $scope, Constants, $http, $state, $rootScope, httpService, displayResponseBox, $window, $location, tokenStorageService, loadBrandingService, getUrl) {
      // console.log("Entering Login Ctrl");

      var self = this;

      self.response = null;
      self.error = null;
      $scope.removeAndRedirect = null;
      // self.interchangableComponents = null;

      self.signUpData = {
        MembershipNumber: null,
        ZipCode: null,
        LastName: null,
        AntiForgeryTokenId: null,
        ClientUrl : getUrl()
      }

      self.loginData = {
        Username: null,
        Password: null,
        LoginSourceId: Constants.loginSourceId,
        AntiForgeryTokenId: null,
        ClientUrl : getUrl()
      }

      self.regex = {
        ZipCode : Constants.regexs.zip,
        LastName : Constants.regexs.names,
        username : Constants.regexs.username,
        password : Constants.regexs.password,
        anything : Constants.regexs.anything,
      }

      self.responseBoxConfig = displayResponseBox.checkMessage()

      //runs if the request has an http error
      self.error = function (err) {
        if (err.data && err.data.responseObject != null) {
          $location.url( err.data.responseObject.pingToken )
        } else {
            var message = (err.data && err.data.errorMessage) ? err.data.errorMessage : "There was an unexpected error.";
          displayResponseBox.populateResponseBox(self.responseBoxConfig, message, true)
        }

        antiForgeryToken.setAntiForgeryTokenFromError(err);



      }

      self.checkForTerms = function (res) {
        return res.data && res.data.responseObject && res.data.responseObject.pingToken.match(/terms-accept/);
      }

      self.checkForAccountActivation = function (res) {
        return res.data && res.data.responseObject && res.data.responseObject.pingToken.match(/account-activation/);
      }

      // self.loginError = function (err) {
      //   if (self.checkForTerms(err)) {
      //     $location.url( err.data.responseObject.slice(2) )
      //   } else {
      //     self.error(err)
      //   }
      // }

      self.activationSuccess = function (res) {
        // $state.go('sign-up', { token : res.data.responseObject })
        tokenStorageService.setToken(res.data.responseObject);
        $state.go('Sign Up')
        antiForgeryToken.setAntiForgeryToken(res);
      }

       console.log(loadBrandingService._styles.pingURL);

       self.loginSuccess = function (res) {

      if (res.data.errorType == 200) {
        console.log("Login Success");
        tokenStorageService.setToken(res.data.responseObject.sessionToken);

        if ( self.checkForTerms(res) ) {
          $location.url( res.data.responseObject.pingToken )
      }
       else if ( self.checkForAccountActivation(res) ) {
          $location.url( res.data.responseObject.pingToken + "?token=" + res.data.responseObject.sessionToken )
       }
        else {
          console.log(res.data.responseObject);
          console.log(loadBrandingService._styles.pingURL + res.data.responseObject.pingToken)
          $window.location.assign(loadBrandingService._styles.pingURL + res.data.responseObject.pingToken)
        }
      }

      antiForgeryToken.setAntiForgeryToken(res);
       }

      //  angular.element(document).ready(function () {
      //    console.info("Document null");
      $scope.interchangableComponents = contentService._content;
      $scope.interchangableComponents.IDShieldImage = false;
      $scope.interchangableComponents.primericaImage = true;
      //  });

      self.loginRequest = function (event) {
        // console.log('loginCtrl.loginRequest')
        event.preventDefault()

        $('.loginProcessingBtn').button('loading');
        httpService.login(self.loginData)
          .then(self.loginSuccess, self.error)
          .finally(function () { $('.loginProcessingBtn').button('reset'); })
      };

      self.activationRequest = function (event) {
        event.preventDefault();
        $('.signUpProcessingBtn').button('loading');
        httpService.activate(self.signUpData)
          .then(self.activationSuccess, self.error)
          .finally(function () { $('.signUpProcessingBtn').button('reset'); })
      };

          self.populateAntiForgeryToken = function(res) {
            // $scope.interchangableComponents = loadBrandingService.getContent();
            console.log("Antiforgery" + res);
            self.clearCookie();
            antiForgeryToken.setAntiForgeryToken(res);
            self.signUpData.AntiForgeryTokenId =  antiForgeryToken.getAntiForgeryToken();
            self.loginData.AntiForgeryTokenId =  antiForgeryToken.getAntiForgeryToken();

          }

          self.clearCookie = function() {
            tokenStorageService.deleteToken();
          };

          // self.clearCookie();

          // self.partnerName = loadBrandingService.getBaseUrl();

          // if (self.partnerName.match(/idshield/)) {
          //   self.partnerName = "IDSHIELD"
          // } else {
          //   self.partnerName = "PRIMERICA"
          // }

         //
         $('div.fade').removeClass('modal-backdrop');

         loadBrandingService.getStyleSheetPath()
          .then(self.populateAntiForgeryToken, self.error);
        

         console.info("interchangableComponents");
         console.log(self.interchangableComponents);
 }]);

 // $scope.$on('$locationChangeStart', function (event, next, current) {
 //   // console.log(current);
 //   if (current.match("\/login")) {
 //     // console.log("Clicked on body")
 //     $rootScope.responseBox.displayBox = false;
 //     // console.log("self.responseBox.displayBox" + self.responseBox.displayBox)
 //   }
 // })
 //
 // self.showBox = function() {
 //   $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
 //     //assign the "from" parameter to something
 //     if (from.name == "forgot-password" || from.name == "reset-password") {
 //       self.displayBox = true;
 //     }
 //   });
 // }
