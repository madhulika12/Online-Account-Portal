'use strict';

describe('Controller: forgotUsernameCtrl', function () {

  var forgotUsernameCtrl, Constants, httpService, $rootScope, $state, displayResponseBox, antiForgeryToken;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, $document, $http, $q, _httpService_, _$state_, _displayResponseBox_, _antiForgeryToken_) {
    $rootScope = _$rootScope_;
    httpService = _httpService_;
    $state = _$state_;
    displayResponseBox = _displayResponseBox_;
    antiForgeryToken = _antiForgeryToken_;
    forgotUsernameCtrl = $controller('forgotUsernameCtrl', {$scope: $rootScope.$new()})

    spyOn(antiForgeryToken, 'setAntiForgeryToken');
    spyOn(antiForgeryToken, 'setAntiForgeryTokenFromError');

    spyOn(httpService, 'forgotUsername').and.callFake(function () {
      return promiseMock.ret;
    })
    spyOn(httpService, 'forgotPassword').and.callFake(function () {
      return promiseMock.ret;
    })
    spyOn(httpService, "recoverAccount").and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve('Remote call result');
        return deferred.promise;
    });

  }));

  describe('sendForgotUsernameRequest', function () {
    it('should prevent the default event', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();
      forgotUsernameCtrl.sendForgotUsernameRequest(event);
      // $rootScope.$digest()
      expect(event.isDefaultPrevented()).toBeTruthy();
    })
    it('should run httpService.forgotUsername', function () {
      var event = $.Event('click');
      forgotUsernameCtrl.sendForgotUsernameRequest(event);
      expect(httpService.recoverAccount).toHaveBeenCalledWith(forgotUsernameCtrl.recoveryData);

    })
  })

  describe('forgotUserSuccess', function () {
    var testUsername;
    beforeEach(function(){
      testUsername = { data: { responseObject: { username: "Sideshow Bob" } } };
      spyOn(forgotUsernameCtrl, 'showUsernameForceResetModal').and.callThrough();
    })
    it('shoud place the username from the response object on the view', function () {
      forgotUsernameCtrl.forgotUserSuccess(testUsername);
      expect(forgotUsernameCtrl.data.Username).toBe(testUsername.data.responseObject.username);
    })
    it('should execute the showUsernameForceResetModal method', function () {
      forgotUsernameCtrl.forgotUserSuccess(testUsername);
      expect(forgotUsernameCtrl.showUsernameForceResetModal).toHaveBeenCalled();
    })
    it('should set the antiForgeryToken', function () {
      forgotUsernameCtrl.forgotUserSuccess(testUsername);
      expect(antiForgeryToken.setAntiForgeryToken).toHaveBeenCalledWith(testUsername)
    })
    
  })

  describe('backToLoginAfterResetPassword', function () {
    it('should take you back to the login screen', function() {
      spyOn($state, 'go');
      spyOn(forgotUsernameCtrl, 'resetPasswordMessage');
      forgotUsernameCtrl.backToLoginAfterResetPassword({})
      expect($state.go).toHaveBeenCalledWith('login');
    })
  })

  describe('resetPasswordMessage', function () {
    it('should display the message if there is one', function() {
      spyOn(displayResponseBox, 'setMessage');
      var testMessage = { data: { responseObject: "THIS IS ONLY A TEST" } };
      forgotUsernameCtrl.resetPasswordMessage(testMessage);
      expect(displayResponseBox.setMessage).toHaveBeenCalledWith(testMessage.data.responseObject, false);
    })
    it('should display the default message if there is no message given', function() {
      spyOn(displayResponseBox, 'setMessage');
      forgotUsernameCtrl.resetPasswordMessage({});
      expect(displayResponseBox.setMessage).toHaveBeenCalledWith("There was an unexpected error.", false);
    })
  })


  describe('error', function () {
    var ctlr, responseError, displayResponseBox;
    beforeEach(inject(function (_displayResponseBox_) {
      ctlr = forgotUsernameCtrl;
      displayResponseBox = _displayResponseBox_;

      spyOn(displayResponseBox, 'populateResponseBox');

      responseError = {
        data : { errorMessage : "TEST_ERROR_MESSAGE"},

        deleteMessage : function () {
          this.data.errorMessage = null;
          return this;
        },

        deleteData : function () {
          this.data = null;
          return this;
        }
      }
    }))
    it('should execute displayResponseBox.populateResponseBox with the error message if it exists', function () {
      ctlr.error(responseError);
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.responseBoxConfig, responseError.data.errorMessage, true);
    })

    it('should execture displayResponseBox.populateResponseBox with te default message if there is no message in the error', function () {
      ctlr.error(responseError.deleteMessage());
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.responseBoxConfig, "There was an unexpected error.", true);
    })

    it('should execture displayResponseBox.populateResponseBox with te default message if there is no data in the error', function () {
      ctlr.error(responseError.deleteData());
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.responseBoxConfig, "There was an unexpected error.", true);
    })
  })

  describe('resetPass', function () {
    it('should call httpService\'s forgotPassword method with the controller data', function () {

      forgotUsernameCtrl.resetPass();
      expect(httpService.forgotPassword).toHaveBeenCalledWith(forgotUsernameCtrl.data);

    })
  })

  describe('resetPassError', function () {
    it('should hide the username modal', function () {
      spyOn(forgotUsernameCtrl, 'error');
      var spyModal = spyOn( $.fn, 'modal' );
      forgotUsernameCtrl.resetPassError()
      expect( spyModal ).toHaveBeenCalledWith( 'hide' );
    })
    it('should call the error method', function() {
      spyOn(forgotUsernameCtrl, 'error');
      var testError = "YARP";
      forgotUsernameCtrl.resetPassError(testError);
      expect(forgotUsernameCtrl.error).toHaveBeenCalledWith(testError);
    })
  })

  describe('backToLogin', function () {
    it('should hide the username-modal', function () {
      var spyModal = spyOn( $.fn, 'modal' );
      forgotUsernameCtrl.backToLogin()
      expect( spyModal ).toHaveBeenCalledWith( 'hide' );
    })
    it('should ad a listenet to redirect once the modal is hidden', function () {
      var spyModalOn = spyOn( $.fn, 'on' );
      forgotUsernameCtrl.backToLogin()
      expect( spyModalOn ).toHaveBeenCalled();
    })
  })

  describe('showUsernameModal', function () {
    it('should show the username-modal', function () {
      var spyModal = spyOn( $.fn, 'modal' );
      forgotUsernameCtrl.showUsernameModal()
      expect( spyModal ).toHaveBeenCalledWith( 'show' );
    })  
  })

  describe('populateAntiForgeryToken', function () {
    it('should populate the AntiForgeryToken into self.recoveryData using getAntiForgeryToken', function() {
      forgotUsernameCtrl.populateAntiForgeryToken({ data: "test" });
      expect(forgotUsernameCtrl.recoveryData.AntiForgeryTokenId).toBe(antiForgeryToken.getAntiForgeryToken());
    })
    it('should populate the AntiForgeryToken into self.data using getAntiForgeryToken', function() {
      forgotUsernameCtrl.populateAntiForgeryToken({ data: "test" });
      expect(forgotUsernameCtrl.data.AntiForgeryTokenId).toBe(antiForgeryToken.getAntiForgeryToken());
    })
  })


})
