"use strict";
var $window;
beforeEach(module('ssoApp', function($provide) {
  $window = {
    location: { assign: function(){} }, 
    document: window.document,
    navigator: window.navigator
  };

  $provide.value( '$window' , $window );
}));

describe('Controller: AccountActivationCtrl', function () {

  var AccountActivation, Constants, httpService, $rootScope, Constants, loadBrandingService, tokenValidationService, tokenStorageService, antiForgeryToken;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _Constants_, _httpService_, _$window_, _loadBrandingService_, _tokenValidationService_, _tokenStorageService_, _antiForgeryToken_) {

    //set shared variables
    $rootScope = _$rootScope_;
    Constants = _Constants_;
    httpService = _httpService_;
    $window = _$window_;
    loadBrandingService = _loadBrandingService_;
    tokenValidationService = _tokenValidationService_;
    tokenStorageService = _tokenStorageService_;
    antiForgeryToken = _antiForgeryToken_;

    //create mocks
    spyOn(httpService, 'firstTimeActivate').and.callFake(function () {
      return promiseMock.ret
    })
    spyOn(antiForgeryToken, 'setAntiForgeryToken');
    spyOn(antiForgeryToken, 'setAntiForgeryTokenFromError');

    //instantiate controller
    AccountActivation = $controller('AccountActivationCtrl', {$scope: $rootScope.$new()});
  }));


  describe('activationRequest', function () {
    it('prevents the default event', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();
      AccountActivation.activationRequest(event);
      expect(event.isDefaultPrevented()).toBeTruthy();

    })

    it('runs httpService.firstTimeActivate with its controller data', function () {
      var event = $.Event('click');

      AccountActivation.activationRequest(event);

      expect(httpService.firstTimeActivate).toHaveBeenCalledWith(AccountActivation.data)

    })
  })

  describe('activationSuccess', function () {
    it('should redirect to the url passed in the response', function () {
      spyOn($window.location, 'assign');
      var testResponse = { data: { responseObject: "SUPERTEST" } };
      var testUrl = loadBrandingService._styles.pingURL + testResponse.data.responseObject;

      AccountActivation.activationSuccess(testResponse);
      expect($window.location.assign).toHaveBeenCalledWith(testUrl);
    })
  })

  describe('error', function () {
    var ctlr, responseError, displayResponseBox;
    beforeEach(inject(function (_displayResponseBox_) {
      ctlr = AccountActivation
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

  describe('invalidTokenError', function () {
    var controller, testResponseError, displayResponseBox, message;
    beforeEach(inject(function (_displayResponseBox_) {
      controller = AccountActivation
      displayResponseBox = _displayResponseBox_

      spyOn(displayResponseBox, 'setMessage')

      message = "Your session has expired, please enter your username and password to continue the activation process.";
      testResponseError = { data : { responseObject : { message: "I am error" } } };
    }))
    it('should execute displayResponseBox.setMessage with the default message', function () {
      controller.invalidTokenError(testResponseError);
      expect(displayResponseBox.setMessage).toHaveBeenCalledWith(message, true)
    })
    it('should set the antiForgeryToken', function () {
      controller.invalidTokenError(testResponseError);
      expect(antiForgeryToken.setAntiForgeryTokenFromError).toHaveBeenCalledWith(testResponseError)
    })
  })

  describe('incorrectError', function () {
    it('should console log' + 'Error' + 'if the activationRequest firstTimeActivate call fails', function () {
      spyOn(console, "log");
      AccountActivation.incorrectError("Anything");
      expect(console.log).toHaveBeenCalledWith('Error');
    })
  })
  
  describe('populateAntiForgeryToken', function () {
    it('should set the antiForgeryToken', function () {
      var mockToken = { data: "MOCK_ANTI_FORGERY__TOKEN" };
      AccountActivation.populateAntiForgeryToken(mockToken);
      expect(antiForgeryToken.setAntiForgeryToken).toHaveBeenCalledWith(mockToken)
    })
    it('should populate the AntiForgeryToken into self.data ', function() {
      var mockToken = { data: "MOCK_ANTI_FORGERY__TOKEN" };
      AccountActivation.populateAntiForgeryToken(mockToken);
      expect(AccountActivation.data.AntiForgeryTokenId).toBe(antiForgeryToken.getAntiForgeryToken());
    })
  })
  
  describe('populateId', function () {
    it('should populate the AntiForgeryToken into self.data ', function() {
      var answerToken = tokenValidationService.getToken();
      spyOn(tokenStorageService, "setToken");

      AccountActivation.populateId("Anything");

      expect(AccountActivation.data.SessionId).toBe(answerToken);
      expect(tokenStorageService.setToken).toHaveBeenCalledWith(answerToken);
    })
  })

});
