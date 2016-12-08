'use strict';

describe('Controller: updateEmailCtrl', function () {

  var UpdateEmailCtrl, httpService, $rootScope, $timeout, $httpBackend, $state, displayResponseBox, tokenStorageService, antiForgeryToken;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _httpService_, _$state_, _$timeout_, _$httpBackend_, _displayResponseBox_, _tokenStorageService_, _antiForgeryToken_) {
    //create shared variables
    $rootScope = _$rootScope_
    httpService = _httpService_
    $timeout = _$timeout_;
    $httpBackend = _$httpBackend_;
    $state = _$state_;
    displayResponseBox = _displayResponseBox_;
    tokenStorageService = _tokenStorageService_;
    antiForgeryToken = _antiForgeryToken_;

    //create mocks
    spyOn(httpService, 'updateEmail').and.callFake(function () {
      return promiseMock.ret
    })
    spyOn(httpService, 'forgotPassword').and.callFake(function () {
      return promiseMock.ret
    })
    spyOn($state, 'go')
    spyOn(antiForgeryToken, 'setAntiForgeryToken');
    spyOn(antiForgeryToken, 'setAntiForgeryTokenFromError');

    //instantiate controller
    UpdateEmailCtrl = $controller('updateEmailCtrl', {$scope: $rootScope.$new()})

    $httpBackend.when('GET', 'https://mws.stage.kroll.com/api/v1/security/tokens')
    .respond(200, { responseObject: {access_token: "test", refresh_token: "test"}, errorMessage: 'No Worries' });


  }));

  // Method not currently in use
  // xdescribe('on instantiation', function () {
  //   it('should execute tokenValidationService.checkTokenAndRedirect', function () {
  //     //TODO now
  //   })
  // })

  describe('updateEmailRequest', function () {
    it('should prevent the default event', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();
      UpdateEmailCtrl.updateEmailRequest(event);
      expect(event.isDefaultPrevented()).toBeTruthy();
    })
    it('should run httpService.updateEmail', function () {
      var event = $.Event('click');
      UpdateEmailCtrl.updateEmailRequest(event);
      expect(httpService.updateEmail).toHaveBeenCalledWith(UpdateEmailCtrl.updateEmailData)

    })
  })

  describe('updateEmailSuccess', function () {
    it('should execute resetPassword', function () {
      spyOn(UpdateEmailCtrl, 'resetPassword');
      UpdateEmailCtrl.updateEmailSuccess();

      $timeout.flush(3000);
      expect(UpdateEmailCtrl.resetPassword).toHaveBeenCalled();
    })
    it('should set the antiForgeryToken', function () {
      UpdateEmailCtrl.updateEmailSuccess("Anything");
      expect(antiForgeryToken.setAntiForgeryToken).toHaveBeenCalledWith("Anything");
    })
  })

  describe('error', function () {
    var responseError;
    beforeEach(function () {
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
    })
    it('should execute displayResponseBox.populateResponseBox with the error message if it exists', function () {
      UpdateEmailCtrl.error(responseError)
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(UpdateEmailCtrl.responseBoxConfig, responseError.data.errorMessage, true)
    })

    it('should execute displayResponseBox.populateResponseBox with the default message if there is no message in the error', function () {
      UpdateEmailCtrl.error(responseError.deleteMessage())
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(UpdateEmailCtrl.responseBoxConfig, "There was an unexpected error.", true)
    })

    it('should execute displayResponseBox.populateResponseBox with the default message if there is no data in the error', function () {
      UpdateEmailCtrl.error(responseError.deleteData())
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(UpdateEmailCtrl.responseBoxConfig, "There was an unexpected error.", true)
    })

    it('should set the antiForgeryToken', function () {
      UpdateEmailCtrl.error(responseError);
      expect(antiForgeryToken.setAntiForgeryTokenFromError).toHaveBeenCalledWith(responseError);
    })
  })

  describe('resetPasswordSuccess', function () {
    var answer, mockResponse;
    beforeEach(function(){
      mockResponse = { data: { responseObject: "A password recovery email was sent your account." } };
      answer = mockResponse.data.responseObject;
    })
    it('should set the response box message with the email recovery message and a green background', function () {
      var defaultMessage = "A password recovery email was sent your account.";
      spyOn(displayResponseBox, 'setMessage')
      UpdateEmailCtrl.resetPasswordSuccess(mockResponse)
      expect(displayResponseBox.setMessage).toHaveBeenCalledWith(answer, false)
    })
    it('should redirect to the login screen', function () {
      UpdateEmailCtrl.resetPasswordSuccess(mockResponse);
      expect($state.go).toHaveBeenCalledWith('login');
    })
    it('should set the antiForgeryToken', function () {
      UpdateEmailCtrl.resetPasswordSuccess(mockResponse);
      expect(antiForgeryToken.setAntiForgeryToken).toHaveBeenCalledWith(mockResponse);
    })
  })

  describe('resetPassword', function () {
    it('should execute httpService.forgotPassword with forgotPasswordData', function () {
      UpdateEmailCtrl.resetPassword();
      expect(httpService.forgotPassword).toHaveBeenCalledWith(UpdateEmailCtrl.forgotPasswordData);
    })
  })

  describe('populateAntiForgeryToken', function () {
    var mockStoredToken, mockAntiForgeryToken;
    beforeEach(function(){
      mockStoredToken = tokenStorageService.getToken();
      mockAntiForgeryToken = antiForgeryToken.getAntiForgeryToken();
      spyOn(UpdateEmailCtrl, 'checkCookie');
    }) 
    it('should populate the AntiForgeryToken into self.updateEmailData ', function() {
      UpdateEmailCtrl.populateAntiForgeryToken();
      expect(UpdateEmailCtrl.updateEmailData.AntiForgeryTokenId).toBe(mockAntiForgeryToken);
    })
    it('should populate the AntiForgeryToken into self.forgotPasswordData ', function() {
      UpdateEmailCtrl.populateAntiForgeryToken();
      expect(UpdateEmailCtrl.forgotPasswordData.AntiForgeryTokenId).toBe(mockAntiForgeryToken);
    })

    it('should populate the SessionId into self.updateEmailData ', function() {
      UpdateEmailCtrl.populateAntiForgeryToken();
      expect(UpdateEmailCtrl.updateEmailData.SessionId).toBe(mockStoredToken);
    })
    it('should populate the SessionId into self.forgotPasswordData ', function() {
      UpdateEmailCtrl.populateAntiForgeryToken();
      expect(UpdateEmailCtrl.forgotPasswordData.SessionId).toBe(mockStoredToken);
    })
    it('should check the cookies', function() {
      UpdateEmailCtrl.populateAntiForgeryToken();
      expect(UpdateEmailCtrl.checkCookie).toHaveBeenCalled();
    })
  })

})
