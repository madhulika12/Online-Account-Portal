'use strict';

/**
 * @ngdoc overview
 * @name ssoApp
 * @description
 * # ssoApp
 *
 * Main module of the application.
 */

// var routerApp = angular.module('routerApp', ['ui.router', 'ui.bootstrap', 'ngCookies']);

angular
  .module('ssoApp', ['ui.router', 'kendo.directives', 'ngSanitize', 'ngAnimate', 'ui.bootstrap', 'ngCookies'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    //   $modalProvider.options.animation = false;
  $urlRouterProvider.otherwise('/invalid');
  $stateProvider
  .state('user', {
    url: '/',
    resolve: {
      loadBrandingService: 'loadBrandingService',
      contentService : 'contentService',

      content : function(contentService) {
        return contentService.getContent()
      },

      styleSheetPromise : function (loadBrandingService) {
        return loadBrandingService.getStyleSheetPath()
      },
    },
    views: {
      'header': {
        templateUrl: 'appFiles/header/header.html',
        controller: function ($scope, loadBrandingService, contentService) {
          $scope.styles = loadBrandingService.getStyles();
          $scope.clientContent = contentService.getMultiClientContent();
          $scope.sessionTimeout = loadBrandingService.sessionTimeout()
          console.log($scope.sessionTimeout)
        }
      },
      'view': {
        template: '',
        controller: function ($state, $scope) {
          $state.go('Sign In')
          $scope.test = "In the view controller";
          console.info("View parent");
          console.log($scope.test);
        },
      },
      'footer': {
        templateUrl: 'appFiles/footer/footer.html',
        controller: function ($scope, loadBrandingService) {
          console.log("View controller")
        }
      },
    },
  })
  .state('invalid', {
      url: 'invalid',
      parent: 'user',
      views: {
          'view@': {
            templateUrl: 'appFiles/error/403.html',
            controller: 'sessionTimout',
            controllerAs: 'session'
          }
      },
  })
  .state('Sign In', {
      url: 'login',
      parent: 'user',
      views: {
          'view@': {
              controller: 'loginCtrl',
              controllerAs: 'login',
              templateUrl: 'appFiles/login/login.html'

          }
      }
  })

  .state('test', {
      url: 'test',
      parent: 'user',
      views: {
          'view@': {
              templateUrl: 'appFiles/login/login.html',
              controller: 'test'
          }
      }
  })

  .state('Account Activation', {
    url: 'account-activation?token',
    parent: 'user',
    views: {
        'view@': {
            controller: 'AccountActivationCtrl',
            controllerAs: 'accActivate',
            templateUrl: 'appFiles/accountActivation/accountActivation.html'

        }
    }
  })
  .state('Terms and Conditions', {
      url: 'terms-and-conditions',
      parent: 'user',
      views: {
          'view@': {
              templateUrl: 'appFiles/termsAndConditions/termsAndConditions.html',
              controller: 'termsAndConditions',
            //   controllerAs: 'terms'
          }
      }
  })
  .state('Accept Terms and Conditions', {
      url: 'terms-accept?token',
      parent: 'user',
      views: {
          'view@': {
              templateUrl: 'appFiles/termsAccept/termsAccept.html',
              controller: 'termsAcceptanceCtrl',
              controllerAs: 'termsAccept',
          }
      }
  })


  .state('Browser Compatibility', {
      url: 'browser',
      parent: 'user',
      views: {
          'view@': {
              templateUrl: 'appFiles/browser/browser.html',
              controller: 'sessionTimout',
              controllerAs: 'session'

          }
      }
  })
  .state('Contact Us', {
      url: 'contact-us',
      parent: 'user',
      views: {
          'view@': {
              templateUrl: 'appFiles/contactIDShield/contactIDShield.html',
              controller: 'contactCtrl',
              controllerAs: 'contact'

          }
      }
  })
 .state('Privacy Policy', {
      url: 'privacy-policy',
      parent: 'user',
      views: {
          'view@': {
              templateUrl: 'appFiles/privacyPolicy/privacyPolicy.html',
              controller: 'sessionTimout',
              controllerAs: 'session'

          }
      }
  })
  .state('Recover Account', {
      url: 'account/recover-account',
      parent: 'user',
      views: {
          'view@': {
              controller: 'recoverAccountCtrl',
              controllerAs: 'recover',
              templateUrl: 'appFiles/recoverAccount/recoverAccount.html'

          }
      }
  })
  .state('Having Trouble Logging In', {
    url: 'having-trouble',
    parent: 'user',
    views: {
      'view@' : {
        controller: 'havingTroubleCtrl',
        controllerAs: 'havingTrouble',
        templateUrl: 'appFiles/havingTrouble/havingTrouble.html'
      }
    }
  })
  .state('Forgot Username', {
    url: 'forgot-username',
    parent: 'user',
    views: {
      'view@' : {
        controller: 'recoverAccountCtrl',
        controllerAs: 'recover',
        templateUrl: 'appFiles/forgotUsername/forgotUsername.html'
      }
    }
  })
  .state('memberAccountActivation', {
    url: 'member/account-activation',
    parent: 'user',
    views: {
        'view@': {
            templateUrl: 'appFiles/memberAccountActivation/memberAccountActivation.html'

        }
    }
  })
  .state('Update Profile', {
      url: 'member/profile',
      parent: 'user',
      views: {
          'view@': {
              controller: 'updateProfile',
              controllerAs: 'update',
              templateUrl: 'appFiles/updateProfile/updateProfile.html'
          }
      }
  })
  .state('Forgot Password', {
      url: 'forgot-password',
      parent: 'user',
      views: {
          'view@': {
              controller: 'forgotPasswordCtrl',
              controllerAs: 'forgotPass',
              templateUrl: 'appFiles/forgotPassword/forgotPassword.html'
          }
      }
  })
  .state('Reset Password', {
      url: 'account/reset-password?sptoken',
      parent: 'user',
      views: {
          'view@': {
              controller: 'resetPasswordCtrl',
              controllerAs: 'resetPass',
              templateUrl: 'appFiles/resetPassword/resetPassword.html'
          }
      }
  })
  .state('Sign Up', {
      url: 'account/sign-up',
      parent: 'user',
      views: {
          'view@': {
              templateUrl: 'appFiles/signUp/signUp.html',
              controller: 'signUpCtrl',
              controllerAs: 'signUp'
          }
      }
  })
  .state('Update Email Address', {
      url: 'account/update-email',
      parent: 'user',
      views: {
          'view@': {
              controller: 'updateEmailCtrl',
              controllerAs: 'upEmail',
              templateUrl: 'appFiles/updateEmail/updateEmail.html'
          }
      }
  })
 // this block below removes the hash tag from angular urls

//   $locationProvider.html5Mode({
//     enabled: true,
//     requireBase: false
//   });
})

.run(function ($rootScope) {
  $rootScope.$on('$stateChangeSuccess', function () {
    document.body.scrollTop = 0;
  })

})
