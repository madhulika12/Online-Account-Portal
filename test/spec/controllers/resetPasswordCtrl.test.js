'use strict';

describe('Controller: resetPasswordCtrl', function () {

  var resetPasswordCtrl, $timeout, httpService, $rootScope, $state, displayResponseBox, $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, $document, $http, $q, _$timeout_, _httpService_, _$state_, _displayResponseBox_, _$httpBackend_) {

    //create shared variables
    httpService = _httpService_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    displayResponseBox = _displayResponseBox_;
    $httpBackend = _$httpBackend_;

    $httpBackend.when('GET', 'https://mws.stage.kroll.com/api/v1/security/tokens')
    .respond(200, { responseObject: {access_token: "test", refresh_token: "test"}, errorMessage: 'What now?!?' });

    //create mocks
    spyOn($http, 'post').and.callFake(function (item) {
      return $q.when()
    })
    spyOn(httpService, 'setPassword').and.callFake(function () {
      return $q.when()
    })

    spyOn($state, 'go')


    //instantiate controller
    resetPasswordCtrl = $controller('resetPasswordCtrl', {$scope: $rootScope.$new()});

    //setting spies and attributes on controller
    resetPasswordCtrl.form = {
      password : {
        $viewValue : "Test1234"
      }
    }

  }));

  xdescribe('on instantiation', function () {
    it('should run checkToken', function () {
      //TODO now
    })
  });

  describe('checkRequirements', function () {
    beforeEach(function(){
    })
    it('should check if the new password is the correct length', function () {
      resetPasswordCtrl.checkRequirements();
      expect(resetPasswordCtrl.valid.length).toBeTruthy();

      resetPasswordCtrl.form.password.$viewValue = "2Short";
      resetPasswordCtrl.checkRequirements();
      expect(resetPasswordCtrl.valid.length).toBeFalsy();
    })
    it('should check if the new password has a lowercase letter', function () {
      resetPasswordCtrl.checkRequirements();
      expect(resetPasswordCtrl.valid.lowerCase).toBeTruthy();

      resetPasswordCtrl.form.password.$viewValue = "YELLING1!";
      resetPasswordCtrl.checkRequirements();
      expect(resetPasswordCtrl.valid.lowerCase).toBeFalsy();
    })
    it('should check if the new password has an uppercase letter', function () {
      resetPasswordCtrl.checkRequirements();
      expect(resetPasswordCtrl.valid.upperCase).toBeTruthy();

      resetPasswordCtrl.form.password.$viewValue = "whisper1!";
      resetPasswordCtrl.checkRequirements();
      expect(resetPasswordCtrl.valid.upperCase).toBeFalsy();
    })
    it('should check if the new password has a number', function () {
      resetPasswordCtrl.checkRequirements();
      expect(resetPasswordCtrl.valid.number).toBeTruthy();

      resetPasswordCtrl.form.password.$viewValue = "NoNumber";
      resetPasswordCtrl.checkRequirements();
      expect(resetPasswordCtrl.valid.number).toBeFalsy();
    })

    //
    it('should fail if form is empty', function () {
      resetPasswordCtrl.form.password.$viewValue = undefined;
      resetPasswordCtrl.checkRequirements();
      expect(resetPasswordCtrl.valid.length).toBe(null);
      expect(resetPasswordCtrl.valid.lowerCase).toBe(null);
      expect(resetPasswordCtrl.valid.upperCase).toBe(null);
      expect(resetPasswordCtrl.valid.number).toBe(null);
    })
    //
  })

  describe('setPasswordRequest', function () {
    it('prevents the default event', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();
      resetPasswordCtrl.setPasswordRequest(event);
      // $rootScope.$digest()
      expect(event.isDefaultPrevented()).toBeTruthy();

    })
    it('calls httpService\'s setPassword function with its data', function () {
      var event = $.Event('click');
      resetPasswordCtrl.setPasswordRequest(event);
      expect(httpService.setPassword).toHaveBeenCalledWith(resetPasswordCtrl.data)
    })
  })

  describe('successMessage', function () {
    it('should set the responseBox message with the successful password reset message', function () {
      var successfulResetMessage = "The password for your account was successfully reset. Please use the new password to log into the mobile app as well as the web portal.";
      spyOn(displayResponseBox, 'setMessage')
      resetPasswordCtrl.successMessage();
      expect(displayResponseBox.setMessage).toHaveBeenCalledWith(successfulResetMessage, false)
    })
    it('should redirect to the login screen', function () {
      resetPasswordCtrl.successMessage();
      expect($state.go).toHaveBeenCalledWith('login');
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
      resetPasswordCtrl.error(responseError)
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(resetPasswordCtrl.responseBoxConfig, responseError.data.errorMessage, true)
    })

    it('should execute displayResponseBox.populateResponseBox with the default message if there is no message in the error', function () {
      resetPasswordCtrl.error(responseError.deleteMessage())
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(resetPasswordCtrl.responseBoxConfig, "There was an unexpected error.", true)
    })

    it('should execute displayResponseBox.populateResponseBox with the default message if there is no data in the error', function () {
      resetPasswordCtrl.error(responseError.deleteData())
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(resetPasswordCtrl.responseBoxConfig, "There was an unexpected error.", true)
    })
  })

  describe('showResetModal', function () {
    it('should show the password-reset-expired-modal', function () {
      var spyModal = spyOn( $.fn, 'modal' );
      resetPasswordCtrl.showResetModal()
      expect( spyModal ).toHaveBeenCalledWith( 'show' );
    })
    it('should set a listener on the hidden.bs.modal event which redirects to the login', function () {
      var spyModalOn = spyOn( $.fn, 'on' );
      resetPasswordCtrl.showResetModal()
      expect( spyModalOn ).toHaveBeenCalled();
    })
  })

  describe('backToLogin', function () {
    it('should hide the password-reset-expired-modal', function () {
      var spyModal = spyOn( $.fn, 'modal' );
      resetPasswordCtrl.backToLogin()
      expect( spyModal ).toHaveBeenCalledWith( 'hide' );
    })
  })

  describe('populateAntiForgeryToken', function () {
    it('should popluate the AntiForgeryToken into self.data ', function() {
      var mockToken = { data: "MOCK_ANTI_FORGERY_TOKEN" };
      resetPasswordCtrl.populateAntiForgeryToken(mockToken);
      expect(resetPasswordCtrl.data.AntiForgeryTokenId).toBe(mockToken.data);
    })
  })

  describe('$watch', function () {
    it('should should call checkRequirements each digest cycle ', function() {
      spyOn(resetPasswordCtrl, 'checkRequirements');
      $rootScope.$digest();
      $httpBackend.flush();
      expect(resetPasswordCtrl.checkRequirements).toHaveBeenCalled();
    })
  })
});
