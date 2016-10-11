
beforeEach(module('ssoApp'));

beforeEach(module(function($urlRouterProvider) {
  $urlRouterProvider.deferIntercept();
}));

var promiseMock;

beforeEach(inject(function ($httpBackend , $http, $q){

  promiseMock = {
    ret : $q.resolve(),

    setReject : function (ret) {
      this.ret = $q.reject(ret)
    },

    setResolve : function (ret) {
      this.ret = $q.resolve(ret)
    }
  }


}));
