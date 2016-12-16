angular.module('ssoApp')
.service('sessionService', ['tokenStorageService', '$http', 'Constants', '$q', '$httpParamSerializerJQLike', function (tokenStorageService, $http, Constants, $q, $httpParamSerializerJQLike) {

  return {
            data : {
            SessionId : tokenStorageService.getToken(),
            AntiForgeryTokenId : null
          }

      }
}])
