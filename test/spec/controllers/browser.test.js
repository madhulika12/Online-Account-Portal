'use strict';

describe('Controller: browserCtrl', function () {

  var BrowserCtrl, tokenStorageService, $rootScope;

  beforeEach(inject(function ($controller, _$rootScope_, $document, $http, $q, _tokenStorageService_) {
    tokenStorageService = _tokenStorageService_;
    $rootScope = _$rootScope_;

    BrowserCtrl = $controller('browserCtrl', {$scope: $rootScope.$new()});

  }));

  describe('checkCookie', function () {
    it('calls refresh Cookie', function () {
      spyOn(tokenStorageService, 'refreshCookie');
      BrowserCtrl.checkCookie();
      expect(tokenStorageService.refreshCookie).toHaveBeenCalled()
    })
  })

});
