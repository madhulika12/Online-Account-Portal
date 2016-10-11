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
  $urlRouterProvider.otherwise('/invalid');
  $stateProvider
  .state('user', {
    url: '/',
    resolve: {
      loadBrandingService: 'loadBrandingService',
      styleSheetPromise : function (loadBrandingService) {
        return loadBrandingService.getStyleSheetPath()
      }
    },
    views: {
      'header': {
        templateUrl: 'appFiles/header/header.html',
        controller: function ($scope, loadBrandingService) {
          $scope.styles = loadBrandingService.getStyles()
        }
      },
    //   'view': {
    //     template: '',
    //     controller: function ($state) {
    //       $state.go('update-profile')
    //     },
    //   },
      'footer': {
        templateUrl: 'appFiles/footer/footer.html',
      },
    },
  })
  .state('invalid', {
      url: 'invalid',
      parent: 'user',
      views: {
          'view@': {
            templateUrl: 'appFiles/error/403.html'
          }
      },
  })
  .state('login', {
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

  .state('accountActivation', {
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
  .state('termsAndConditions', {
      url: 'terms-and-conditions',
      parent: 'user',
      views: {
          'view@': {
              templateUrl: 'appFiles/termsAndConditions/termsAndConditions.html'
          }
      }
  })
  .state('terms-accept', {
      url: 'terms-accept?token',
      parent: 'user',
      views: {
          'view@': {
              templateUrl: 'appFiles/termsAccept/termsAccept.html',
              controller: 'termsAcceptanceCtrl',
              controllerAs: 'termsAccept'
          }
      }
  })


  .state('browser', {
      url: 'browser',
      parent: 'user',
      views: {
          'view@': {
              templateUrl: 'appFiles/browser/browser.html'

          }
      }
  })
  .state('contactIDShield', {
      url: 'contact-us',
      parent: 'user',
      views: {
          'view@': {
              templateUrl: 'appFiles/contactIDShield/contactIDShield.html'

          }
      }
  })
 .state('privacyPolicy', {
      url: 'privacy-policy',
      parent: 'user',
      views: {
          'view@': {
              templateUrl: 'appFiles/privacyPolicy/privacyPolicy.html'

          }
      }
  })
  .state('recover-account', {
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
  .state('having-trouble', {
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
  .state('forgot-username', {
    url: 'forgot-username',
    parent: 'user',
    views: {
      'view@' : {
        controller: 'forgotUsernameCtrl',
        controllerAs: 'forgotUsername',
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
  .state('update-profile', {
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
  .state('forgot-password', {
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
  .state('reset-password', {
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
  .state('sign-up', {
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
  .state('update-email', {
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
//  // this block below removes the hash tag from angular urls
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