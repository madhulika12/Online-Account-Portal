angular.module('ssoApp')
    .service('contentService', ['loadBrandingService', '$http','$q', 'getUrl', 'antiForgeryToken', 'Constants', 'httpService', function(loadBrandingService, $http, $q, getUrl, antiForgeryToken, Constants, httpService) {            
            var deferred = $q.defer();
            var self = this;

            self.data = {
                ClientUrl: getUrl()
                // AntiForgeryTokenID: null
            };

            var functions =  {
            deferred : deferred,
            promise : deferred.promise,
            data : {
                ClientUrl: getUrl(),
                AntiForgeryTokenID: null
            },
            test : {antiForgeryToken : null},

            _content : {},

            getContentPromise : function () {
                return this.promise
            },

            getMultiClientContent : function () {
                return this.content;
            },

            _setContent : function (data) {
                antiForgeryToken.setAntiForgeryToken(data);
                if (data.data.errorType === 404 || !data.data.responseObject) {
                    } else {
                    this._content = data.data.responseObject;
                }
            },

            getContent : function () {
                var lbs = this;
                // self.data.AntiForgeryTokenI/D = antiForgeryToken.getAntiForgeryToken();
                // console.log(data);

                // test.newAntiforgeryToken = antiForgeryToken.getAntiForgeryToken();

                // $http({
                //     method: 'POST',
                //     url: 'https://mws.stage.kroll.com/api/v1/client/content',
                //     data: self.data,
                //     headers : { 'Content-Type' : 'application/x-www-form-urlencoded'}
                // })

                $http.post('https://auth-api.charlie.kroll.com/api/v1/client/content', {'ClientUrl': getUrl()})
                //  $http.post('https://mws.charlie.kroll.com/api/v1/client/content', {'ClientUrl': getUrl()})
                   .then(function (res) {
                        lbs._setContent(res);
                        lbs.deferred.resolve(res);
                    }, function (err) {
                        lbs._setDefault();
                        lbs.deferred.resolve(err);
                    })
                    return this.promise;
                }
            }

        return functions;

    }
]);