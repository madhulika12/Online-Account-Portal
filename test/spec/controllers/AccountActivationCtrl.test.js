"use strict";

describe('Controller: AccountActivationCtrl', function () {

  var AccountActivation, Constants, httpService, $rootScope, Constants;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _Constants_, _httpService_) {

    //set shared variables
    $rootScope = _$rootScope_;
    Constants = _Constants_;
    httpService = _httpService_;

    //create mocks
    spyOn(httpService, 'firstTimeActivate').and.callFake(function () {
      return promiseMock.ret
    })

    //instantiate controller
    AccountActivation = $controller('AccountActivationCtrl', {$scope: $rootScope.$new()});
  }));


  describe('activationRequest', function () {
    it('prevents the default event', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();
      AccountActivation.activationRequest(event);
      expect(event.isDefaultPrevented()).toBeTruthy();

    })

    it('runs httpService.firstTimeActivate with its controller data', function () {
      var event = $.Event('click');

      AccountActivation.activationRequest(event);

      expect(httpService.firstTimeActivate).toHaveBeenCalledWith(AccountActivation.data)

    })
  })

  xdescribe('activationSuccess', function () {
    it('should redirect to the url passed in the response', function () {
      //TODO once that function is written
    })
  })

  describe('error', function () {
    var ctlr, responseError, displayResponseBox;
    beforeEach(inject(function (_displayResponseBox_) {
      ctlr = AccountActivation
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

});
