'use strict';

describe('Controller: sessionTimout', function () {

  var SessionCtrl, tokenStorageService, $rootScope, $location, httpService, $state, displayResponseBox;

  beforeEach(inject(function ($controller, _$rootScope_, $document, $http, $q, _tokenStorageService_, _$location_, _httpService_, _$state_, _displayResponseBox_) {
    tokenStorageService = _tokenStorageService_;
    $rootScope = _$rootScope_;
    $location = _$location_;
    $state = _$state_;
    httpService = _httpService_;
    displayResponseBox = _displayResponseBox_;

    SessionCtrl = $controller('sessionTimout', {$scope: $rootScope.$new()});

  }));

  describe('extendCookieExpiry', function () {
    beforeEach(function(){
      spyOn(tokenStorageService, 'refreshCookie');
      spyOn(httpService, 'extendTimeout');
    })
    it('should check on the Cookie', function () {
      SessionCtrl.extendCookieExpiry();
      expect(tokenStorageService.refreshCookie).toHaveBeenCalled()
    })
    it('should contact the backend to extend timeout', function () {
      SessionCtrl.extendCookieExpiry();
      expect(httpService.extendTimeout).toHaveBeenCalled()
    })
  })

  describe('showModal', function () {
    it('calls refresh Cookie?', function () {
      spyOn(tokenStorageService, 'refreshCookie');
      SessionCtrl.showModal();
      expect(tokenStorageService.refreshCookie).toHaveBeenCalled()
    })
  })

  describe('checkCookie', function () {
    it('calls refresh Cookie', function () {
      spyOn(tokenStorageService, 'refreshCookie');
      SessionCtrl.checkCookie();
      expect(tokenStorageService.refreshCookie).toHaveBeenCalled()
    })
  })

  describe('backToLoginRoute', function () {
    beforeEach(function(){
      spyOn($state, 'go');

    })
    it('should go back to the login', function () {
      SessionCtrl.backToLoginRoute();
      expect($state.go).toHaveBeenCalledWith('login')
    })
    it('should hide the modal?', function () {
      var spyModal = spyOn( $.fn, 'modal' );
      SessionCtrl.backToLoginRoute();
      expect( spyModal ).toHaveBeenCalledWith( 'hide' );
    })
    it('should remove modal-backdrop classes', function () {
      var spyModal = spyOn( $.fn, 'removeClass' );
      SessionCtrl.backToLoginRoute();
      expect( spyModal ).toHaveBeenCalledWith( 'modal-backdrop' );
    })
    it('should remove modal-open classes', function () {
      var spyModal = spyOn( $.fn, 'removeClass' );
      SessionCtrl.backToLoginRoute();
      expect( spyModal ).toHaveBeenCalledWith( 'modal-open' );
    })
    it('should remove modal-open classes', function () {
      spyOn(displayResponseBox, 'setMessage' );
      SessionCtrl.backToLoginRoute();
      expect( displayResponseBox.setMessage ).toHaveBeenCalled();
    })

  })
});
