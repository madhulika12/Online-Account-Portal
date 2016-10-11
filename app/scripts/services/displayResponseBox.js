angular.module('ssoApp')
    .service('displayResponseBox', ['$http', '$location', '$q', function ($http, $location, $q) {
      var responseBoxVal = {
        message : null,
        error : true,
        display : false
      };

      return {
        _nullMessage : {
          message : null,
          error : true,
          display : false
        },
        _eraseStoredMessage : function () {
          responseBoxVal = angular.copy(this._nullMessage)
        },
        setMessage : function (message, errorState) {
          responseBoxVal.message = message;
          responseBoxVal.error = errorState;
          responseBoxVal.display = true;
        },
        checkMessage : function () {
          var ret = responseBoxVal
          this._eraseStoredMessage()
          return ret
        },

        //THESE FUNCTIONS ARE FOR MANIPUTLATING A RESPONSE BOX WHILE STILL ON THE SAME PAGE AS THE RESPONSE BOX
        //THEY HAVE NOTHING TO DO WITH SETTING A MESSAGE AND DISPLAYING IT ON A NEW SCREEN
        populateResponseBox : function (boxConfig, message, errorStatus) {
          boxConfig.message = message
          boxConfig.error = errorStatus
          boxConfig.display = true
        },
        // emptyResponseBox : function (boxConfig) {
        //   boxConfig.message = null
        //   boxConfig.error = false
        //   boxConfig.display = false
        // }
      }
    }]);
