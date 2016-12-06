angular.module('ssoApp')
  .service('tokenValidationService', ['displayResponseBox', '$http', '$location', '$q', 'Constants', '$state', '$stateParams', 'httpService', 'antiForgeryToken', 'getUrl', function (displayResponseBox, $http, $location, $q, Constants, $state, $stateParams, httpService, antiForgeryToken, getUrl) {

    return {
      deferred : null,
      token : null,
      data : {
        SessionId: null ,
        ClientUrl: getUrl()
      },
      validateJWTData : {
        Token: null,
        ClientUrl: getUrl()
      },

      _tokenInvalid : function (err) {
        this.deferred.reject(err)
      },

      _checkResponse : function (res) {
        (res.data.errorType !== 200) ? this._tokenInvalid(res) : this.deferred.resolve(res);
      },

      _requestTokenValidation : function () {
        httpService.validateAccountActivation(this.data)
          .then(this._checkResponse.bind(this), this._tokenInvalid.bind(this))
      },

      _requestJWTValidation : function () {
        httpService.validateJWT(this.validateJWTData)
          .then(this._checkResponse.bind(this), this._tokenInvalid.bind(this))
      },

      getToken: function () {
        return $stateParams.token
      },

      getJWT: function () {
        return $stateParams.sptoken
      },

      checkJWT : function () {
        this.validateJWTData.Token = this.getJWT()

        this.deferred = $q.defer()

        if (this.validateJWTData.Token) {
          this._requestJWTValidation()
        } else {
          this._tokenInvalid({ data : { errorMessage : "Missing token" } })
        }

        return this.deferred.promise

      },

      checkToken : function () {
        this.data.SessionId = this.getToken();

        this.deferred = $q.defer()

        if (this.data.SessionId) {
          this._requestTokenValidation()
        } else {
          this._tokenInvalid({ data : { errorMessage : "Missing token" } })
        }

        return this.deferred.promise
      },



      checkTokenAndRedirect : function () {
        this.checkToken()
          .catch(function (err) {
            // console.log('validation of token error', err)
            // $state.go('login') //changed this for account activation
           })
        return this.deferred.promise
      }

    }

  }]);
