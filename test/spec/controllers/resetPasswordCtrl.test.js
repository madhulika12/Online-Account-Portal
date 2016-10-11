'use strict';

describe('Controller: resetPasswordCtrl', function () {

  var resetPasswordCtrl, $timeout, httpService, $rootScope, $state;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, $document, $http, $q, _$timeout_, _httpService_, _$state_) {

    //create shared variables
    httpService = _httpService_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
    $state = _$state_;

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
        $viewValue : "test123"
      }
    }
    spyOn(resetPasswordCtrl, 'checkRequirements')

  }));

  xdescribe('on instantiation', function () {
    it('should run checkToken', function () {
      //TODO now
    })
  });

  xdescribe('checkRequirements', function () {
    it('should check if the new password is the correct length', function () {
      //TODO now
    })
    it('should check if the new password has a lowercase letter', function () {
      //TODO now
    })
    it('should check if the new password has an uppercase letter', function () {
      //TODO now
    })
    it('should check if the new password has a number', function () {
      //TODO now
    })
  })

  describe('setPasswordRequest', function () {
    it('prevents the default event', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();
      resetPasswordCtrl.setPasswordRequest(event);
      $rootScope.$digest()
      expect(event.isDefaultPrevented()).toBeTruthy();

    })
    it('calls httpService\'s setPassword function with its data', function () {
      var event = $.Event('click');
      resetPasswordCtrl.setPasswordRequest(event);
      expect(httpService.setPassword).toHaveBeenCalledWith(resetPasswordCtrl.data)
    })
  })

  xdescribe('successMessage', function () {
    it('should set the responseBox message with the successful password reset message', function () {
      //TODO now
    })
    it('should redirect to the login screen', function () {
      //TODO now
    })
  })

  describe('error', function () {
    var ctlr, responseError, displayResponseBox;
    beforeEach(inject(function (_displayResponseBox_) {
      ctlr = resetPasswordCtrl
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

  xdescribe('showResetModal', function () {
    it('should show the password-reset-expired-modal', function () {
      //TODO now
    })
    it('should set a listener on the hidden.bs.modal event which redirects to the login', function () {
      //TODO now
    })
  })

  xdescribe('backToLogin', function () {
    it('should hide the password-reset-expired-modal', function () {
      //TODO now
    })
  })
});
