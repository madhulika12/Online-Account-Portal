angular.module('ssoApp')
    .service('multiClient', ['loadBrandingService', '$q', 'getUrl', 'antiForgeryToken', 'Constants', function(loadBrandingService, $q, getUrl, antiForgeryToken, Constants) {
            
            var deferred = $q.defer()

            var functions =  {
            deferred : deferred,
            promise : deferred.promise,
            data : {
                ClientUrl: getUrl(),
                AntiForgeryTokenID: null
            },

            _content : {},

            _defaultStyles : Constants.defaultStyles,

            getStyleSheetPromise : function () {
                return this.promise
            },

            getMultiClientContent : function () {
                return this._styles
            },

            _setContent : function (data) {
                antiForgeryToken.setAntiForgeryToken(data);
                if (data.data.errorType === 404 || !data.data.responseObject) {
                    this._setDefault()
                    } else {
                    this._content = data.data.responseObject;
                }
            },

            getContent : function () {
                var lbs = this;
                data.AntiForgeryTokenID = antiForgeryToken.getAntiForgeryToken();

                httpService.client(data)
                    .then(function (res) {
                        lbs._setContent(res)
                        lbs.deferred.resolve(res)
                    }, function (err) {
                        lbs._setDefault()
                        lbs.deferred.resolve(err)
                    })
                    return this.promise
                }
            }

        return functions;

    }
]);