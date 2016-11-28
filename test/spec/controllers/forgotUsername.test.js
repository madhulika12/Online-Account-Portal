'use strict';

describe('Controller: forgotUsernameCtrl', function () {

  var forgotUsernameCtrl, Constants, httpService, $rootScope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, $document, $http, $q, _httpService_) {
    $rootScope = _$rootScope_
    httpService = _httpService_
    forgotUsernameCtrl = $controller('forgotUsernameCtrl', {$scope: $rootScope.$new()})

    spyOn(httpService, 'forgotUsername').and.callFake(function () {
      return promiseMock.ret
    })
    spyOn(httpService, 'forgotPassword').and.callFake(function () {
      return promiseMock.ret
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

  xdescribe('forgotUserSuccess', function (res) {
    it('shoud place the username from the response object on the view', function () {
      //TODO when written
    })
    it('should execute the showUsernameModal method', function () {
      //TODO could be done now
    })
  })


  describe('error', function () {
    var ctlr, responseError, displayResponseBox;
    beforeEach(inject(function (_displayResponseBox_) {
      ctlr = forgotUsernameCtrl
      displayResponseBox = _displayResponseBox_

      spyOn(displayResponseBox, 'setMessage')

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
    it('should execute displayResponseBox.setMessage with the error message if it exists', function () {
      ctlr.error(responseError)
      expect(displayResponseBox.setMessage).toHaveBeenCalledWith(responseError.data.errorMessage, true)
    })

    it('should execture displayResponseBox.setMessage with te default message if there is no message in the error', function () {
      ctlr.error(responseError.deleteMessage())
      expect(displayResponseBox.setMessage).toHaveBeenCalledWith("There was an unexpected error.", true)
    })

    it('should execture displayResponseBox.setMessage with te default message if there is no data in the error', function () {
      ctlr.error(responseError.deleteData())
      expect(displayResponseBox.setMessage).toHaveBeenCalledWith("There was an unexpected error.", true)
    })
  })

  describe('resetPass', function () {
    it('should call httpService\'s forgotPassword method with the controller data', function () {

      forgotUsernameCtrl.resetPass()
      expect(httpService.forgotPassword).toHaveBeenCalledWith(forgotUsernameCtrl.data)

    })
  })

  xdescribe('resetPassError', function () {
    it('should hide the username modal', function () {
      //TODO now
    })
    it('should run the error method', function () {
      //TODO now
    })
  })

  xdescribe('backToLogin', function () {
    it('should hide the username-modal', function () {
      //TODO now
    })
    it('should redirect to the login page once the modal has been hidden', function () {
      //TODO now
    })
  })


})
