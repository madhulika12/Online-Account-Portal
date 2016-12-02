'use strict';

describe('Controller: updateEmailCtrl', function () {

  var UpdateEmailCtrl, httpService, $rootScope, $timeout, $httpBackend, $state, displayResponseBox, tokenStorageService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _httpService_, _$state_, _$timeout_, _$httpBackend_, _displayResponseBox_, _tokenStorageService_) {
    //create shared variables
    $rootScope = _$rootScope_
    httpService = _httpService_
    $timeout = _$timeout_;
    $httpBackend = _$httpBackend_;
    $state = _$state_;
    displayResponseBox = _displayResponseBox_;
    tokenStorageService = _tokenStorageService_;

    //create mocks
    spyOn(httpService, 'updateEmail').and.callFake(function () {
      return promiseMock.ret
    })
    spyOn(httpService, 'forgotPassword').and.callFake(function () {
      return promiseMock.ret
    })
    spyOn($state, 'go')

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
  })

  describe('resetPasswordSuccess', function () {
    it('should set the response box message with the email recovery message and a green background', function () {
      var defaultMessage = "A password recovery email was sent your account.";
      spyOn(displayResponseBox, 'setMessage')
      UpdateEmailCtrl.resetPasswordSuccess()
      expect(displayResponseBox.setMessage).toHaveBeenCalledWith(defaultMessage, false)
    })
    it('should redirect to the login screen', function () {
      UpdateEmailCtrl.resetPasswordSuccess();
      expect($state.go).toHaveBeenCalledWith('login');
    })
  })

  describe('resetPassword', function () {
    it('should execute httpService.forgotPassword with forgotPasswordData', function () {
      UpdateEmailCtrl.resetPassword();
      expect(httpService.forgotPassword).toHaveBeenCalledWith(UpdateEmailCtrl.forgotPasswordData);
    })
  })

  describe('populateAntiForgeryToken', function () {
    var mockToken, mockStoredToken;
    beforeEach(function(){
      mockToken = { data: "MOCK_ANTI_FORGERY__TOKEN" };
      mockStoredToken = tokenStorageService.getToken();
    }) 
    it('should populate the AntiForgeryToken into self.updateEmailData ', function() {
      UpdateEmailCtrl.populateAntiForgeryToken(mockToken);
      expect(UpdateEmailCtrl.updateEmailData.AntiForgeryTokenId).toBe(mockToken.data);
    })
    it('should populate the AntiForgeryToken into self.forgotPasswordData ', function() {
      UpdateEmailCtrl.populateAntiForgeryToken(mockToken);
      expect(UpdateEmailCtrl.forgotPasswordData.AntiForgeryTokenId).toBe(mockToken.data);
    })

    it('should populate the SessionId into self.updateEmailData ', function() {
      UpdateEmailCtrl.populateAntiForgeryToken(mockToken);
      expect(UpdateEmailCtrl.updateEmailData.SessionId).toBe(mockStoredToken);
    })
    it('should populate the SessionId into self.forgotPasswordData ', function() {
      UpdateEmailCtrl.populateAntiForgeryToken(mockToken);
      expect(UpdateEmailCtrl.forgotPasswordData.SessionId).toBe(mockStoredToken);
    })
  })

})
