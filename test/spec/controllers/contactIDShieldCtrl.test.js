'use strict';

describe('Controller: contactCtrl', function () {

  var ContactCtrl, tokenStorageService, $rootScope;

  beforeEach(inject(function ($controller, _$rootScope_, $document, $http, $q, _tokenStorageService_) {
    tokenStorageService = _tokenStorageService_;
    $rootScope = _$rootScope_;

    ContactCtrl = $controller('contactCtrl', {$scope: $rootScope.$new()});

  }));

  describe('checkCookie', function () {
    it('calls refresh Cookie', function () {
      spyOn(tokenStorageService, 'refreshCookie');
      ContactCtrl.checkCookie();
      expect(tokenStorageService.refreshCookie).toHaveBeenCalled()
    })
  })

});
