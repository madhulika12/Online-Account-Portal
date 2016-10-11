angular.module('ssoApp')
.service('loadBrandingService', ['$http', '$location', '$q', 'Constants', 'getUrl', function ($http, $location, $q, Constants, getUrl) {

    var deferred = $q.defer()

    return {
      deferred : deferred,
      promise : deferred.promise,

      _styles : {
          url : null,
          favicon : null,
          title : null,
          logo : null,
          error : null,
          pingURL: null
      },

      _defaultStyles : Constants.defaultStyles,

      getStyleSheetPromise : function () {
        return this.promise
      },

      getStyles : function () {
        return this._styles
      },

      getBaseUrl : function () {
        return getUrl()
      },

      _setStyles : function (data) {
        if (data.data.errorType === 404 || !data.data.responseObject) {
          this._setDefault()
        } else {
          this._styles = data.data.responseObject;
        }
      },

      _setDefault : function () {
        this._styles = this._defaultStyles;
      },

      getStyleSheetPath : function () {
        var lbs = this
        var currentUrl = lbs.getBaseUrl()

        $http
          .get('https://mws.stage.kroll.com/api/v1/vendor/webpage-attributes?url=' + currentUrl)
          .then(function (res) {
            lbs._setStyles(res)
            lbs.deferred.resolve(res)
          }, function (err) {
            lbs._setDefault()
            lbs.deferred.resolve(err)
          })
        return this.promise
      }
    }

}])
