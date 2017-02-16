'use strict';

angular.module('ssoApp')
  .controller('browserCtrl', ['$scope', 'Constants', '$http', '$state', '$rootScope', 'httpService', 'displayResponseBox', '$window', '$location', 'tokenStorageService', 'loadBrandingService',function($scope, Constants, $http, $state, $rootScope, httpService, displayResponseBox, $window, $location, tokenStorageService, loadBrandingService) {

    // console.log("Inside browserCtrl.js");

      var self = this;

      self.checkCookie = function () {
        tokenStorageService.refreshCookie();
      };

      self.checkCookie();

      // console.log(document.getElementById('bootstrapDatePicker'));

  $(document).ready(function() {
      $('#bootstrapDatePicker').datetimepicker({
        format: 'MM/DD/YYYY'
      });    
  })

  $('#bootstrapDatePicker').prop('disabled', true);  


    }]);
