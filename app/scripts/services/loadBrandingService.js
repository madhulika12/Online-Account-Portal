angular.module('ssoApp')
.service('loadBrandingService', ['antiForgeryToken', '$http', '$location', '$q', 'Constants', 'getUrl', 'httpService', function (antiForgeryToken, $http, $location, $q, Constants, getUrl, httpService) {

    var deferred = $q.defer();
    var idleTime = 0;

    var functions =  {
      deferred : deferred,
      promise : deferred.promise,

            data : {
                ClientUrl: getUrl(),
                AntiForgeryTokenID: null
            },      

      _styles : {
          url : null,
          favicon : null,
          title : null,
          logo : null,
          error : null,
          pingURL: null
      },

      content : {},

      _defaultStyles : Constants.defaultStyles,

      getStyleSheetPromise : function () {
        return this.promise;
      },

      getStyles : function () {
        return this._styles;
      },

      getPingURL : function() {
        return this._styles.pingURL;
      },

      getBaseUrl : function () {
        return getUrl();
      },

      _setStyles : function (data) {
        antiForgeryToken.setAntiForgeryToken(data);
        if (data.data.errorType === 404 || !data.data.responseObject) {
          this._setDefault();
        } else {
          this._styles = data.data.responseObject;
        }
      },

      _setMultiContent : function (data) {
        antiForgeryToken.setAntiForgeryToken(data);
        if (data.data.errorType === 404 || !data.data.responseObject) {
          this._setDefault();
        } else {
          this.content = data.data.responseObject;
        }
      },
      
      setContent : function() {
        return this.content;
      },

      getContent : function () {
        var lbs = this;
                this.data.AntiForgeryTokenID = antiForgeryToken.getAntiForgeryToken();

                httpService.content(this.data)
                    .then(function (res) {
                      lbs._setMultiContent(res);
                      // console.info("In httpService");
                    }, function (err) {
              
                    })
            },

      _setDefault : function () {
        this._styles = this._defaultStyles;
      },

      getStyleSheetPath : function () {
        var lbs = this;
        var currentUrl = lbs.getBaseUrl();

        $http
          // .get('https://auth-api.kroll.com/api/v1/vendor/webpage-attributes?url=' + currentUrl)
          .get('https://auth-api.stage.kroll.com/api/v1/vendor/webpage-attributes?url=' + currentUrl)
          .then(function (res) {
            lbs._setStyles(res);
            lbs.deferred.resolve(res);
          }, function (err) {
            lbs._setDefault();
            lbs.deferred.resolve(err);
          })
        return this.promise;
      },

        sessionTimeout : function() {
          // console.log("In session timeout function");
            $(document).ready(function () {
          //Increment the idle time counter every minute.
          // timerIncrement()
          var idleInterval = setInterval(functions.timerIncrement(), 60000); // 1 minute

          //Zero the idle timer on mouse movement.
          $(this).mousemove(function (e) {
              idleTime = 0;
          });
          $(this).keypress(function (e) {
              idleTime = 0;
          });
      });
      },

      timerIncrement : function() {
          idleTime = idleTime + 1;
          if (idleTime > 2) { // 20 minutes
              // window.location.assign('https://idshieldstage.mysecuredashboard.com/login');
          };
      }
    };

    return functions;

}]);
