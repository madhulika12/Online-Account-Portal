'use strict';

describe('Controller: recoverAccountCtrl', function () {

  var RecoverAccountCtrl, Constants, $rootScope, httpService, $state, usernameService, displayResponseBox, tokenStorageService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _httpService_, _$state_, $q, _usernameService_, _displayResponseBox_, _tokenStorageService_) {

    //create shared variables
    $rootScope = _$rootScope_;
    httpService = _httpService_;
    $state = _$state_;
    usernameService = _usernameService_;
    displayResponseBox = _displayResponseBox_;
    tokenStorageService = _tokenStorageService_;

    //create mocks
    // spyOn(httpService, 'recoverAccount').and.callFake(function () {
    //   return promiseMock.ret
    // })
    spyOn(httpService, "recoverAccount").and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve('recoverAccount Success');
      return deferred.promise;
    });
    spyOn(httpService, 'forgotPassword').and.callFake(function () {
      return promiseMock.ret
    })
    spyOn($state, 'go')
    promiseMock.setResolve({ data : { responseObject : "TEST_RESPONSE"}})

    // instantiate controller
    RecoverAccountCtrl = $controller('recoverAccountCtrl', {$scope: $rootScope.$new()})
  }));


  describe('redirectUpdateEmail', function () {
    it('should store the username from self.usernameData', function () {
      spyOn(usernameService, 'storeUsername');
      RecoverAccountCtrl.redirectUpdateEmail();
      expect(usernameService.storeUsername).toHaveBeenCalledWith(RecoverAccountCtrl.usernameData.Username)
    })

    it('should redirect to the updateEmail page', function () {
      RecoverAccountCtrl.redirectUpdateEmail();
      expect($state.go).toHaveBeenCalledWith("update-email");
    })
  })

  // Showing Modal Function
   describe('showJustUsernameModal', function () {
    it('should show the username modal', function () {
      var spyModal = spyOn( $.fn, 'modal' );
      RecoverAccountCtrl.showJustUsernameModal();
      expect( spyModal ).toHaveBeenCalledWith( 'show' );
    })
  })

  describe('showUsernameForceResetModal', function () {
    it('should show the username-force-reset-modal', function () {
      var spyModal = spyOn( $.fn, 'modal' );
      RecoverAccountCtrl.showUsernameForceResetModal();
      expect( spyModal ).toHaveBeenCalledWith( 'show' );
    })
  }) 

  // Generic modal request functions
  describe('modalRequestError', function () {
      var mockError = "YARP";
    it('should pass the error on to the error method', function () {
      spyOn(RecoverAccountCtrl, 'error');
      RecoverAccountCtrl.modalRequestError(mockError);
      expect(RecoverAccountCtrl.error).toHaveBeenCalledWith(mockError);
    })
    it('should hide the recover page modal', function () {
      var spyModal = spyOn( $.fn, 'modal' );
      RecoverAccountCtrl.modalRequestError(mockError);
      expect( spyModal ).toHaveBeenCalledWith( 'hide' );
    })
  })

  describe('resetPass', function () {
    it('should call the forgotPassword method from the httpService', function () {
      RecoverAccountCtrl.resetPass();
      expect(httpService.forgotPassword).toHaveBeenCalledWith(RecoverAccountCtrl.usernameData);
    })
  })

  describe('resetPassSuccess', function () {
    it('should execute displayResponseBox.setMessage with the email recovery message', function () {
      spyOn(displayResponseBox, 'setMessage');
      RecoverAccountCtrl.resetPassSuccess();
      expect(displayResponseBox.setMessage).toHaveBeenCalledWith("A password recovery email was sent your account.", false);
    })
    it('should redirect to the login page', function () {
      RecoverAccountCtrl.resetPassSuccess();
      expect($state.go).toHaveBeenCalledWith("login");
    })
  })

  // Redirecting to Login Functions
  describe('backToLogin', function () {
    it('should call backToLoginFromModal if there is a modal (length > 0)', function () {
      var fakeElements = ["Test1", "Test2"];
      spyOn(window, "$").and.returnValue(fakeElements);
      spyOn( RecoverAccountCtrl, 'backToLoginFromModal' );
      RecoverAccountCtrl.backToLogin()
      expect( RecoverAccountCtrl.backToLoginFromModal ).toHaveBeenCalled();
    })  
    it('should go back to login using state if there is not a modal', function () {
      RecoverAccountCtrl.backToLogin()
      expect($state.go).toHaveBeenCalledWith("login");
    })
  })

  describe('backToLoginFromModal', function () {
    it('should add a listener to recover-page-modals to redirect once the modal is hidden', function () {
      var spyModalOn = spyOn( $.fn, 'one' );
      RecoverAccountCtrl.backToLoginFromModal()
      expect( spyModalOn ).toHaveBeenCalled();
    })  
    it('should hide the recover-page-modal', function () {
      var spyModal = spyOn( $.fn, 'modal' );
      RecoverAccountCtrl.backToLoginFromModal()
      expect( spyModal ).toHaveBeenCalledWith( 'hide' );
    })
  })

  // Recover Account Functions
  describe('recoverSuccess', function () {
    var mockResponse;
    beforeEach(function(){
      spyOn(tokenStorageService, 'setToken');

      mockResponse = { 
        data: { 
          responseObject: { 
            sessionToken: "SUPER_TEST",
            username: "THOR"
          } 
        } 
      };
    });
    it('should set the token in tokenStorage from the response given', function () {
      var answer = mockResponse.data.responseObject.sessionToken;
      RecoverAccountCtrl.recoverSuccess(mockResponse);
      expect(tokenStorageService.setToken).toHaveBeenCalledWith(answer);
    });
    it('should set the username to self.usernameData.Username if the redirectEndpoint is forgot-username', function () {
      mockResponse.data.responseObject.redirectEndpoint = "forgot-username";
      spyOn(RecoverAccountCtrl, 'showUsernameForceResetModal');
      RecoverAccountCtrl.recoverSuccess(mockResponse);
      expect(RecoverAccountCtrl.usernameData.Username).toBe(mockResponse.data.responseObject.username);
    });
    it('should call showUsernameForceResetModal if the redirectEndpoint is forgot-username', function () {
      mockResponse.data.responseObject.redirectEndpoint = "forgot-username";
      spyOn(RecoverAccountCtrl, 'showUsernameForceResetModal');
      RecoverAccountCtrl.recoverSuccess(mockResponse);
      expect(RecoverAccountCtrl.showUsernameForceResetModal).toHaveBeenCalled();
    });
    it('should set the username to self.usernameData.Username if the redirectEndpoint is account/update-email', function () {
      mockResponse.data.responseObject.redirectEndpoint = "account/update-email";
      spyOn(RecoverAccountCtrl, 'redirectUpdateEmail');
      RecoverAccountCtrl.recoverSuccess(mockResponse);
      expect(RecoverAccountCtrl.usernameData.Username).toBe(mockResponse.data.responseObject.username);
    });
    it('should call redirectUpdateEmail if the redirectEndpoint is account/update-email', function () {
      mockResponse.data.responseObject.redirectEndpoint = "account/update-email";
      spyOn(RecoverAccountCtrl, 'redirectUpdateEmail');
      RecoverAccountCtrl.recoverSuccess(mockResponse);
      expect(RecoverAccountCtrl.redirectUpdateEmail).toHaveBeenCalled();
    });
    it('should call resetPassSuccess if the redirectEndpoint is login', function () {
      mockResponse.data.responseObject.redirectEndpoint = "login";
      spyOn(RecoverAccountCtrl, 'resetPassSuccess');
      RecoverAccountCtrl.recoverSuccess(mockResponse);
      expect(RecoverAccountCtrl.resetPassSuccess).toHaveBeenCalled();
    });
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
      RecoverAccountCtrl.error(responseError)
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(RecoverAccountCtrl.responseBoxConfig, responseError.data.errorMessage, true)
    })

    it('should execture displayResponseBox.populateResponseBox with te default message if there is no message in the error', function () {
      RecoverAccountCtrl.error(responseError.deleteMessage())
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(RecoverAccountCtrl.responseBoxConfig, "There was an unexpected error.", true)
    })

    it('should execture displayResponseBox.populateResponseBox with te default message if there is no data in the error', function () {
      RecoverAccountCtrl.error(responseError.deleteData())
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(RecoverAccountCtrl.responseBoxConfig, "There was an unexpected error.", true)
    })
  })

  describe('requestRecovery', function () {
    it('should prevent the default event', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();
      RecoverAccountCtrl.requestRecovery(event);
      // $rootScope.$digest()
      expect(event.isDefaultPrevented()).toBeTruthy();
    })
    it('should run httpService.requestRecovery', function () {
      var event = $.Event('click');
      RecoverAccountCtrl.requestRecovery(event);
      expect(httpService.recoverAccount).toHaveBeenCalledWith(RecoverAccountCtrl.recoveryData)
    })
  })

  describe('populateAntiForgeryToken', function () {
    it('should popluate the AntiForgeryToken into self.recoveryData ', function() {
      var mockToken = { data: "MOCK_ANTI_FORGERY__TOKEN" };
      RecoverAccountCtrl.populateAntiForgeryToken(mockToken);
      expect(RecoverAccountCtrl.recoveryData.AntiForgeryTokenId).toBe(mockToken.data);
    })
  })

});
