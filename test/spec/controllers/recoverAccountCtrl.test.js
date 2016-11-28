'use strict';

describe('Controller: recoverAccountCtrl', function () {

  var RecoverAccountCtrl, Constants, $rootScope, httpService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _httpService_, $state, $q) {

    //create shared variables
    $rootScope = _$rootScope_;
    httpService = _httpService_;

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

  xdescribe('requestPasswordReset', function () {
    it('should execute httpService.forgotPassword with the username stored in recoverData', function () {
      //TODO now
    })
  })

  xdescribe('resetPassSuccess', function () {
    it('should execute displayResponseBox.setMessage with the email recovery message', function () {
      //TODO now
    })
    it('should redirect to the login page', function () {
      //TODO now
    })
  })

  xdescribe('redirectUpdateEmail', function () {
    it('should redirect to the updateEmail page with the token provided', function () {
      //TODO now
    })
  })

  xdescribe('recoverSuccess', function () {
    it('should execute redirectUpdateEmail with a token screen if ....?????', function () {
      //TODO when that is written
    })
    it('should execute requestPasswordReset if ....?????', function () {
      //TODO when that is written
    })
  })

  describe('error', function () {
    var ctlr, responseError, displayResponseBox;
    beforeEach(inject(function (_displayResponseBox_) {
      ctlr = RecoverAccountCtrl
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

});
