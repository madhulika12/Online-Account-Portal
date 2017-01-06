'use strict';

angular.module('ssoApp')
    .controller('linkElement', ['Constants', '$rootScope', 'loadBrandingService', '$http', '$scope', function(Constants, $rootScope, loadBrandingService, $http, $scope) {


    var self = this;
    loadBrandingService.getStyleSheetPromise()
      .finally(function () {
        self.styles = loadBrandingService.getStyles()
        self.setClient(self.styles.title);
      })

      self.setClient = function(title) {
        self.title = title;

        Constants.client = self.title.substr(0, self.title.indexOf('-') + 1);
      }
      //   self.injectDefault = function (data) {
      //       self.styles.stylesheet = "styles/Kroll/main.css";
      //       self.styles.favicon = "images/Kroll/kroll_favicon.ico";
      //       self.styles.title = "Kroll Identity Theft Protection";
      //       self.styles.logo = "images/Kroll/logo.png";
      //       $state.go("invalid");
      //   }
       //
      //   self.getData = function () {
            // loadBrandingService.getStyleSheetPath()
            //   .then(self.injectStyles, self.injectDefault)
      //   }
       //
      //  console.log("Outside" + self.logo);
    }])
