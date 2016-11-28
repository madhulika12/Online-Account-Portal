'use strict';

describe('Controller: termsAccept', function () {

  var TermsAcceptCtrl, Constants, httpService, $rootScope, tokenStorageService;

  beforeEach(inject(function ($controller, _$rootScope_, _httpService_, $state, _tokenStorageService_) {
    //create shared variables
    $rootScope = _$rootScope_
    httpService = _httpService_
    tokenStorageService = _tokenStorageService_

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
      //TODO when that is written
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
  })

})
