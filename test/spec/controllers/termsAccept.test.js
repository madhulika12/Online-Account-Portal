'use strict';

describe('Controller: termsAccept', function () {

  var TermsAcceptCtrl, Constants, httpService, $rootScope, tokenStorageService, antiForgeryToken;

  beforeEach(inject(function ($controller, _$rootScope_, _httpService_, $state, _tokenStorageService_, _Constants_, _antiForgeryToken_) {
    //create shared variables
    $rootScope = _$rootScope_
    httpService = _httpService_
    tokenStorageService = _tokenStorageService_
    Constants = _Constants_;
    antiForgeryToken = _antiForgeryToken_;

    //creat mocks
    spyOn(httpService, 'acceptTerms').and.callFake(function () {
      return promiseMock.ret
    })
    spyOn(tokenStorageService, 'getToken').and.callFake(function () {
      return "TEST_TOKEN_XXX"
    })
    // spyOn(tokenValidationService, 'checkTokenAndRedirect').and.callFake(function () {
    //   return promiseMock.ret
    // })
    spyOn($state, 'go')
    spyOn(antiForgeryToken, 'setAntiForgeryToken');
    spyOn(antiForgeryToken, 'setAntiForgeryTokenFromError');
    
    //instantiate controller
    TermsAcceptCtrl = $controller('termsAcceptanceCtrl', {$scope: $rootScope.$new()})

  }));

  describe('on instantiation', function () {
    it('should place the token on it\'s data object', function () {
      expect(TermsAcceptCtrl.data.sessionId).toEqual("TEST_TOKEN_XXX")
    })
  })

  describe('acceptTerms', function () {
    it('should prevent the default event', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();
      // console.log(event)
      TermsAcceptCtrl.acceptTerms(event);
      expect(event.isDefaultPrevented()).toBeTruthy();
    })
    it('should run httpService.termsAccept', function () {
      var event = $.Event('click');
      TermsAcceptCtrl.acceptTerms(event);
      expect(httpService.acceptTerms).toHaveBeenCalledWith(TermsAcceptCtrl.data)

    })
  })

  describe('success', function () {
    it('should redirect the user to the ICE Portal', function () {
      spyOn($window.location, 'assign');
      var testResponse = { data: { responseObject: { pingToken: "SUPERTEST" } } };
      var testUrl = Constants.portalBaseUrl + testResponse.data.responseObject.pingToken;

      TermsAcceptCtrl.success(testResponse);
      expect($window.location.assign).toHaveBeenCalledWith(testUrl);
      expect(antiForgeryToken.setAntiForgeryToken).toHaveBeenCalled();
    })
  })

  describe('error', function () {
    var ctlr, responseError, displayResponseBox;
    beforeEach(inject(function (_displayResponseBox_) {
      ctlr = TermsAcceptCtrl
      displayResponseBox = _displayResponseBox_

      spyOn(displayResponseBox, 'populateResponseBox')

      responseError = {
        data : { errorMessage : "TEST_ERROR_MESSAGE"},

        deleteMessage : function () {
          this.data.errorMessage = null
          return this
        },

        deleteData : function () {
          this.data = null
          return this
        }
      }
    }))
    it('should execute displayResponseBox.populateResponseBox with the error message if it exists', function () {
      ctlr.error(responseError)
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.responseBoxConfig, responseError.data.errorMessage, true)
    })

    it('should execture displayResponseBox.populateResponseBox with te default message if there is no message in the error', function () {
      ctlr.error(responseError.deleteMessage())
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.responseBoxConfig, "There was an unexpected error.", true)
    })

    it('should execture displayResponseBox.populateResponseBox with te default message if there is no data in the error', function () {
      ctlr.error(responseError.deleteData())
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.responseBoxConfig, "There was an unexpected error.", true)
    })
    it('should set the antiForgeryToken', function () {
      ctlr.error(responseError);
      expect(antiForgeryToken.setAntiForgeryTokenFromError).toHaveBeenCalledWith(responseError);
    })
  })

  describe('populateId', function () {
    it('should place the MemberId on the controllers data object', function () {
      var mockData = { data: { responseObject: { id: 9001 } } };
      TermsAcceptCtrl.populateId(mockData);
      expect(TermsAcceptCtrl.data.MemberId).toEqual(9001)
    })
  })

  describe('populateAntiForgeryToken', function () {
    it('should popluate the AntiForgeryToken into self.data ', function() {
      spyOn(TermsAcceptCtrl, 'checkCookie');
      TermsAcceptCtrl.populateAntiForgeryToken("Anything");
      expect(TermsAcceptCtrl.data.AntiForgeryTokenId).toBe(antiForgeryToken.getAntiForgeryToken());
    })
    it('check the cookies ', function() {
      spyOn(TermsAcceptCtrl, 'checkCookie');
      TermsAcceptCtrl.populateAntiForgeryToken("Anything");
      expect(TermsAcceptCtrl.checkCookie).toHaveBeenCalled();
    })
  })

})
