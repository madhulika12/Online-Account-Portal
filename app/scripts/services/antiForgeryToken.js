/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('ssoApp')
.service('antiForgeryToken', ['$http', '$location', '$q', 'Constants', 'getUrl', function ($http, $location, $q, Constants, getUrl) {

    var deferred = $q.defer()
    var idleTime = 0;
    var antiForgeryToken;

    var functions =  {
      
      setAntiForgeryToken : function(res){
          antiForgeryToken =  res.headers('XSRF-TOKEN');
      },

      setAntiForgeryTokenFromError : function(err){
          antiForgeryToken =  err.headers('XSRF-TOKEN');
      },
      
      getAntiForgeryToken : function() {
        return antiForgeryToken;
      }
    };

    return functions;

}])
