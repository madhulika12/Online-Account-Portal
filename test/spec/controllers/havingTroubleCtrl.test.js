'use strict';

describe('Controller: havingTroubleCtrl', function () {

  var havingTroubleCtrl, Constants, httpService, $rootScope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, $document, $http, $q, _httpService_, $state) {
    $rootScope = _$rootScope_
    httpService = _httpService_
    havingTroubleCtrl = $controller('havingTroubleCtrl', {$scope: $rootScope.$new()})

    // spyOn(httpService, 'forgotPassword').and.callFake(function () {
    //   return promiseMock.ret
    // })
    spyOn(httpService, "forgotPassword").and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve('Forgot Password Success');
      return deferred.promise;
    });

    spyOn($state, 'go')

  }));

  describe('forgotPasswordRequest', function () {
    it('should prevent the default event', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();
      havingTroubleCtrl.forgotPasswordRequest(event);
      // $rootScope.$digest()
      expect(event.isDefaultPrevented()).toBeTruthy();
    })
    it('should run httpService.forgotPassword', function () {
      var event = $.Event('click');
      havingTroubleCtrl.forgotPasswordRequest(event);
      expect(httpService.forgotPassword).toHaveBeenCalledWith(havingTroubleCtrl.forgotPassData)

    })
  })

  xdescribe('forgotPassSuccess', function () {
    it('should set the responseBox with the password recover message', function () {
      //TODO now
    })
    it('should redirect to the login page', function () {
      //TODO now
    })
  })

  describe('error', function () {
    var ctlr, responseError, displayResponseBox;
    beforeEach(inject(function (_displayResponseBox_) {
      ctlr = havingTroubleCtrl
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

})
