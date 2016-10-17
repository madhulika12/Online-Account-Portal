angular.module('ssoApp')
  .service('tokenValidationService', ['displayResponseBox', '$http', '$location', '$q', 'Constants', '$state', '$stateParams', 'httpService', function (displayResponseBox, $http, $location, $q, Constants, $state, $stateParams, httpService) {

    return {
      deferred : null,
      token : null,

      _tokenInvalid : function (err) {
        this.deferred.reject(err)
      },

      _checkResponse : function (res) {
        (res.data.errorType !== 200) ? this._tokenInvalid(res) : this.deferred.resolve(res);
      },

      _requestTokenValidation : function () {
        httpService.validateAccountActivation({ token : this.token })
          .then(this._checkResponse.bind(this), this._tokenInvalid.bind(this))
      },

      _requestJWTValidation : function () {
        httpService.validateJWT({ sptoken : this.token })
          .then(this._checkResponse.bind(this), this._tokenInvalid.bind(this))
      },

      getToken: function () {
        return $stateParams.token
      },

      getJWT: function () {
        return $stateParams.sptoken
      },

      checkJWT : function () {
        this.token = this.getJWT()
        this.deferred = $q.defer()

        if (this.token) {
          this._requestJWTValidation()
        } else {
          this._tokenInvalid({ data : { errorMessage : "Missing token" } })
        }

        return this.deferred.promise

      },

      checkToken : function () {
        this.token = this.getToken();
        this.deferred = $q.defer()

        if (this.token) {
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
            $state.go('login') //changed this for account activation 
           })
        return this.deferred.promise
      }

    }

  }]);
