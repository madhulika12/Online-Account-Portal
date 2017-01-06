'use strict';

describe('Service: tokenValidationService', function () {

  var tokenValidationService, $rootScope, httpService, $stateParams;

  beforeEach(inject(function (_tokenValidationService_, _$rootScope_, _httpService_, _$stateParams_) {

    tokenValidationService = _tokenValidationService_;
    $stateParams = _$stateParams_;
    $rootScope = _$rootScope_;
    httpService = _httpService_;

    promiseMock.setResolve({ data : { errorType : 200}})

    spyOn(httpService, 'validate').and.callFake(function () {
      return promiseMock.ret
    })
    spyOn(httpService, 'validateJWT').and.callFake(function () {
      return promiseMock.ret
    })
    spyOn(tokenValidationService, '_tokenInvalid').and.callThrough()
    spyOn(tokenValidationService, '_checkResponse').and.callThrough()

  }));

  xdescribe('_checkResponse', function () {
    beforeEach(function () { $stateParams.token = "TEST_TOKEN_ABC"; })
    it('should run _tokenInvalid if the errorType of the response is not 200', function () {
      promiseMock.setResolve({ data : { errorType : 400 }})
      tokenValidationService.checkToken()
      $rootScope.$digest()
      expect(tokenValidationService._tokenInvalid).toHaveBeenCalled()

    })
    it('should resolve the promise if the errorType of the response is a 200', function () {
      var promiseResolved = false
      promiseMock.setResolve({ data : { errorType : 200 }})
      tokenValidationService.checkToken()
        .then(function () { promiseResolved = true; })
      $rootScope.$digest()
      expect(promiseResolved).toBe(true)
    })
  })

  xdescribe('_requestTokenValidation', function () {
    beforeEach(function () { $stateParams.token = "TEST_TOKEN_ABC"; })
    it('should run httpService.validate with .token', function () {
      tokenValidationService.checkToken()
      expect(httpService.validate).toHaveBeenCalledWith({ token : "TEST_TOKEN_ABC" })
    })
    it('if the response is positive it should run checkResponse', function () {
      tokenValidationService.checkToken()
      $rootScope.$digest()
      expect(tokenValidationService._checkResponse).toHaveBeenCalled()
    })
    it('if the response is negative it should run _tokenInvalid', function () {
      promiseMock.setReject({})
      tokenValidationService.checkToken()
      $rootScope.$digest()
      expect(tokenValidationService._tokenInvalid).toHaveBeenCalled()
    })
  })

  describe('getToken', function () {
    beforeEach(inject(function() {
      $stateParams.token = "TEST_TOKEN_ABC"
    }))
    it('should return the token key of the stateParams', function () {
      expect(tokenValidationService.getToken()).toEqual("TEST_TOKEN_ABC")
    })
  })

  xdescribe('checkToken', function () {
    beforeEach(inject(function (_$stateParams_) {
      spyOn(tokenValidationService, '_requestTokenValidation').and.callThrough()
    }))
    it('should execute _requestTokenValidation if there is a token', function () {
      $stateParams.token = "TEST_TOKEN_ABC";
      tokenValidationService.checkToken()
      $rootScope.$digest()
      expect(tokenValidationService._requestTokenValidation).toHaveBeenCalled()
    })
    it('should execute _tokenInvalid if there is no token', function () {
      $stateParams.token = null;
      tokenValidationService.checkToken()
      $rootScope.$digest()
      expect(tokenValidationService._tokenInvalid).toHaveBeenCalled()
    })
  })

  describe('checkTokenAndRedirect', function () {
    // var $state
    // beforeEach(inject(function (_$state_) {
    //   $state = _$state_
    //   spyOn($state, 'go');
    // }))
    // it('should redirect to the login page if the token is invalid', function () {
    //   tokenValidationService.checkTokenAndRedirect()
    //   $rootScope.$digest()
    //   expect($state.go).toHaveBeenCalledWith('login')
    // })
    xit('should return a promise that other responses can be chained off of', function () {
      var promiseRejected = false
      tokenValidationService.checkTokenAndRedirect()
        .catch(function () {
          promiseRejected = true
        })
      $rootScope.$digest()
      expect(promiseRejected).toBe(true)
    })
  })

  describe('checkJWT', function () {
    beforeEach(inject(function (_$stateParams_) {
      spyOn(tokenValidationService, '_requestJWTValidation').and.callThrough()
    }))
    it('should execute _requestTokenValidation if there is a token', function () {
      $stateParams.sptoken = "TEST_TOKEN_ABC";
      tokenValidationService.checkJWT()
      $rootScope.$digest()
      expect(tokenValidationService._requestJWTValidation).toHaveBeenCalled()
    })
    it('should execute _tokenInvalid if there is no token', function () {
      $stateParams.token = null;
      tokenValidationService.checkJWT()
      $rootScope.$digest()
      expect(tokenValidationService._tokenInvalid).toHaveBeenCalled()
    })
  })

});
