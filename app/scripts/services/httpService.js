angular.module('ssoApp')
.service('httpService', ['$http', 'Constants', '$q', '$httpParamSerializerJQLike', function ( $http, Constants, $q, $httpParamSerializerJQLike) {

  return {

    _buildConfigure : function (method, endpoint, data) {
      //
      return {
        method : method,
        url : endpoint,
        data: $httpParamSerializerJQLike(data),
        params : data,
        headers : { 'Content-Type' : 'application/x-www-form-urlencoded'}
      }
    },

    checkResponse : function (def) {
      return function (res) {
        (!res.data || res.data.errorType !== 200 ) ? def.reject(res) : def.resolve(res);
      }
    },

    request : function (config) {

      var deferred = $q.defer()

      $http(config)
        .then(this.checkResponse(deferred), deferred.reject)

      return deferred.promise

    },

    activate : function (data) {
      var con = this._buildConfigure('POST', Constants.endpoints.activate, data)
      return this.request(con)
    },

    login : function (data) {
      // console.log('httpService.login')
      var con = this._buildConfigure('POST', Constants.endpoints.login, data)
      return this.request(con)
    },


    extendTimeout : function (data) {
      // console.log('httpService.login')
      var con = this._buildConfigure('POST', Constants.endpoints.extendTimeout, data)
      return this.request(con)
    },


    recoverAccount : function (data) {
      var con = this._buildConfigure('POST', Constants.endpoints.recoverAccount, data)
      return this.request(con)
    },

    delCookie : function (data) {
      var con = this._buildConfigure('POST', Constants.endpoints.delCookie, data)
      return this.request(con)
    },
    

    validate : function (data) {
      var con = this._buildConfigure('GET', Constants.endpoints.getMemberByToken, data)
      return this.request(con)
    },

    validateJWT : function (data) {
      var con = this._buildConfigure('GET', Constants.endpoints.validateJWT, data)
      return this.request(con)
    },

    signUp : function (data) {
      var con = this._buildConfigure('POST', Constants.endpoints.signUp, data , 'application/json')
      return this.request(con)
    },

    changePassword : function (data) {
      //THIS ONE IS NOT TO RECOVER A PASSWORD, IT'S TO RESET A PASSWORD AFTER BEING LOGGED IN
      var con = this._buildConfigure('POST', Constants.endpoints.changePassword, data)
      return this.request(con)
    },

    setPassword : function (data) {
      //THIS ONE ACTUALLY SENDS A A NEW PASSWORD TO BE SET
      var con = this._buildConfigure('POST', Constants.endpoints.setPassword, data)
      return this.request(con)
    },

    validateAccountActivation : function (data) {
      //THIS ONE ACTUALLY SENDS A A NEW PASSWORD TO BE SET
      var con = this._buildConfigure('POST', Constants.endpoints.validateAccountActivation, data)
      return this.request(con)
    },
    
    antiForgeryToken : function (data) {
      //THIS ONE ACTUALLY SENDS A A NEW PASSWORD TO BE SET
      console.log(data);
      var con = this._buildConfigure('GET', Constants.endpoints.antiForgeryToken, data)
      console.log(this.request(con));
      return this.request(con)
    },

    updateProfile : function (data) {
      var con = this._buildConfigure('POST', Constants.endpoints.updateProfile, data)
      return this.request(con)
    },

    updateEmail : function (data) {
      var con = this._buildConfigure('POST', Constants.endpoints.updateEmail, data)
      return this.request(con)
    },

    forgotPassword : function (data) {
      //THIS ONE SENDS THE EMAIL
      var con = this._buildConfigure('POST', Constants.endpoints.forgotPassword, data)
      return this.request(con)
    },

    acceptTerms : function (data) {
      console.log('httpService#acceptTerms data param', data)
      var con = this._buildConfigure('POST', Constants.endpoints.acceptTerms, data)
      return this.request(con)
    },

    firstTimeActivate : function (data) {
      var con = this._buildConfigure('POST', Constants.endpoints.firstTimeActivate, data)
      return this.request(con)
    },

    forgotUsername : function (data) {
      var con = this._buildConfigure('POST', Constants.endpoints.forgotUsername, data)
      return this.request(con)
    },

    // getMember : function (data) {
    //   var con = this._buildConfigure('GET', Constants.endpoints.getMemberByToken, data)
    //   // console.log("Get Member");
    //   // console.dir(data);
    //   return this.request(con)
    // },

    getMember : function (data) {
      var con = this._buildConfigure('POST', Constants.endpoints.getMemberByToken, data)
      // console.log("Get Member");
      // console.dir(data);
      return this.request(con)
    },

    emailExist : function (emailString) {
      // console.log('checking email')
      var con = this._buildConfigure('GET', Constants.endpoints.emailExist, { emailUserId : emailString})
      return this.request(con)
    },

    usernameExist : function (usernameString) {
      // console.log('checking username')
      var con = this._buildConfigure('GET', Constants.endpoints.usernameExist, { emailUserId : usernameString})
      return this.request(con)
    }
  }
}])
