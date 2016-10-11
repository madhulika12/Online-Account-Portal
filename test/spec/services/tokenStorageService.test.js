'use strict';

describe('Service: tokenValidationService', function () {

  var tokenStorageService, $rootScope, $cookies, $stateParams, now, Constants, fifteenMinutes;

  beforeEach(inject(function (_tokenStorageService_, _$cookies_, _$rootScope_, _Constants_) {

    tokenStorageService = _tokenStorageService_;
    Constants = _Constants_;
    $rootScope = _$rootScope_;
    $cookies = _$cookies_;

    now = 0;
    fifteenMinutes = Constants.fifteenMinutes;


  }));

  describe('setToken', function () {
    it('should set a cookie with the tokenCookieKey and the token passed to it', function () {
      tokenStorageService.setToken("TEST_TOKEN")
      var cookie = $cookies.get(Constants.tokenCookieKey)
      expect(cookie).toEqual("TEST_TOKEN")
    })
  })
  describe('getToken', function () {
    it('should retrieve the token from the cookie', function () {
      tokenStorageService.setToken("TEST_TOKEN")
      expect(tokenStorageService.getToken()).toEqual("TEST_TOKEN")
    })
  })
  describe('deleteToken', function () {
    it('should remove the cookie', function () {
      tokenStorageService.setToken("TEST_TOKEN")
      expect(tokenStorageService.getToken()).toEqual("TEST_TOKEN")
      tokenStorageService.deleteToken()
      expect(tokenStorageService.getToken()).toBeUndefined()
    })
  })
  describe('refreshCookie', function () {
    it('should retrieve the cookie and set it again', function () {
      spyOn(tokenStorageService, 'setToken')
      spyOn(tokenStorageService, 'getToken')
      tokenStorageService.refreshCookie()
      expect(tokenStorageService.setToken).toHaveBeenCalled()
      expect(tokenStorageService.getToken).toHaveBeenCalled()
    })
  })
})
