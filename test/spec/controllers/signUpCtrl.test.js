'use strict';

describe('Controller: SignUpCtrl', function () {

  var SignUpCtrl, httpService, $rootScope, $window, tokenValidationService, Constants;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, $document, $q, _httpService_, _$window_, _tokenValidationService_, _Constants_) {

    //create shared variables
    $rootScope = _$rootScope_;
    $window = _$window_;
    Constants = _Constants_;
    tokenValidationService = _tokenValidationService_;
    httpService = _httpService_;

    //create mocks
    // spyOn(httpService, 'signUp').and.callFake(function () {
    //   return promiseMock.ret
    // })
    spyOn(httpService, "signUp").and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve('signUp Success');
      return deferred.promise;
    });
    spyOn(tokenValidationService, 'checkTokenAndRedirect').and.callFake(function () {
      return $q.resolve()
    })
    spyOn(httpService, 'getMember').and.callFake(function () {
      return $q.resolve({data : {}})
    })

    //instantiate controller
    SignUpCtrl = $controller('signUpCtrl', { $scope: $rootScope.$new() });
    // $rootScope.$digest()
  }));

  // Doesn't look like this is done anymore
  // describe('on instantiation', function () {
  //   it('should call tokenValidationService.checkToken', function () {
  //     expect(tokenValidationService.checkTokenAndRedirect).toHaveBeenCalled()
  //   })
  // })

  //TODO populateForm and requestMemberData

  describe('sendSignUpRequest', function () {
    it('should call the httpService.signUp method with the signUp data', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();

      SignUpCtrl.sendSignUpRequest(event)

      expect(httpService.signUp).toHaveBeenCalledWith(SignUpCtrl.data)
    });

    xdescribe('on positive response, positiveSignUpRedirect', function () {
      it('should redirect to the ice portal', function () {

        spyOn($window.location, 'assign')
        var event = $.Event('click');
        expect(event.isDefaultPrevented()).toBeFalsy();

        promiseMock.setResolve({ data : { responseObject : "URL_TEST"}})
        SignUpCtrl.sendSignUpRequest(event)
        $rootScope.$digest()
        expect($window.location.assign).toHaveBeenCalledWith(Constants.portalBaseUrl + "URL_TEST")
      })
    })

    xdescribe('on negative response, error', function () {

      it('should place an error message on the response box config', function () {
        var event = $.Event('click');
        expect(event.isDefaultPrevented()).toBeFalsy();

        promiseMock.setReject({ data : { errorMessage: "TEST_123_321"}})

        SignUpCtrl.sendSignUpRequest(event)
        $rootScope.$digest()
        expect(SignUpCtrl.responseBoxConfig.message).toEqual("TEST_123_321")
      })

    })

  });

  describe('requestMemberData', function () {
    it('should execture the httpService.getMember method with the query string token', function () {
      //TODO now
    })
    it('on a positive response it should execute populateForm with the response', function () {

    })
  })

  describe('setViewAndRender', function () {
    it('should set the view value with the modelCtrl passed to it', function () {
      //TODO now
    })
    it('should run the modelCtrl\'s $render method', function () {
      //TODO now
    })
    it('should run the modelCtrl\'s $validate method', function () {
      //TODO now
    })
  })

  describe('populateForm', function () {
    it('should execture setViewAndRender with the individual data points passed to it', function () {
      //TODO now
    })
  })

});
