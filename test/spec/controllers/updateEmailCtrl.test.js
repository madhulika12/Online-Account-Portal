'use strict';

describe('Controller: updateEmailCtrl', function () {

  var UpdateEmailCtrl, httpService, $rootScope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _httpService_, $state) {
    //create shared variables
    $rootScope = _$rootScope_
    httpService = _httpService_

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

  }));

  xdescribe('on instantiation', function () {
    it('should execute tokenValidationService.checkTokenAndRedirect', function () {
      //TODO now
    })
  })

  describe('updateEmailRequest', function () {
    it('should prevent the default event', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();
      // console.log(event)
      UpdateEmailCtrl.updateEmailRequest(event);
      // $rootScope.$digest()
      expect(event.isDefaultPrevented()).toBeTruthy();
    })
    it('should run httpService.updateEmail', function () {
      var event = $.Event('click');
      UpdateEmailCtrl.updateEmailRequest(event);
      expect(httpService.updateEmail).toHaveBeenCalledWith(UpdateEmailCtrl.updateEmailData)

    })
  })

  xdescribe('updateEmailSuccess', function () {
    it('should execute resetPassword', function () {
      //TODO now
    })
  })

  describe('error', function () {
    var ctlr, responseError, displayResponseBox;
    beforeEach(inject(function (_displayResponseBox_) {
      ctlr = UpdateEmailCtrl
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

  xdescribe('resetPassword', function () {
    it('should execute httpService.forgotPassword with ????', function () {
      //TODO when written
    })
  })

  xdescribe('resetPasswordSuccess', function () {
    it('should set the response box message with the email recovery message and a green background', function () {
      //TODO now
    })
    it('should redirect to the login screen', function () {
      //TODO now
    })
  })

})
