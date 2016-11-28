'use strict';

describe('Controller: LoginCtrl', function () {

  var LoginCtrl, httpService, $rootScope, positiveActivate, httpError;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $state, $q, _httpService_, _$rootScope_) {

    //set shared variables
    $rootScope = _$rootScope_;
    httpService = _httpService_;

    //create mocks
    // spyOn(httpService, 'activate').and.callFake(function () {
    //   return promiseMock.ret
    // })
    spyOn(httpService, "activate").and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve('Activate Success');
      return deferred.promise;
    });
    spyOn(httpService, 'login').and.callFake(function () {
      return promiseMock.ret
    })
    spyOn($state, 'go')

    positiveActivate = {
      data : {
        responseObject : "TEST_TOKEN"
      }
    }
    httpError = {
      data : {
        errorMessage : "TESTERROR",
        responseObject : {}
      }
    }
    promiseMock.setResolve(positiveActivate)

    //instantiate controller
    LoginCtrl = $controller('loginCtrl', { $scope: $rootScope.$new() });

  }));

  xdescribe('on instantiation', function () {
    it('should check for a stored response box message and set it on the responseBoxConfig key', function () {
      //TODO now
    })
  })

  describe('activationRequest', function () {
    it('prevents the default event', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();
      LoginCtrl.activationRequest(event);
      // $rootScope.$digest();
      expect(event.isDefaultPrevented()).toBeTruthy();

    })
    it('should call httpService\'s activate method with the signUpData', function () {
      var event = $.Event('click');
      LoginCtrl.activationRequest(event);
      expect(httpService.activate).toHaveBeenCalledWith(LoginCtrl.signUpData)
    })
  })

  xdescribe('activationSuccess', function () {
    it('should redirect to the sign-up view with the string provided by the response object as the token query paramenter', function () {
      //TODO now
    })
  })

  describe('loginRequest', function () {
    it('prevents the default event', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();
      LoginCtrl.loginRequest(event);
      expect(event.isDefaultPrevented()).toBeTruthy();

    })
    it('makes a post to the login endpoint with the loginData', function () {
      var event = $.Event('click');
      LoginCtrl.loginRequest(event);
      expect(httpService.login).toHaveBeenCalledWith(LoginCtrl.loginData)
    })
  })

  xdescribe('loginSuccess', function () {
    it('should redirect to the url provided in the response object', function () {
      //TODO when written
    })
  })

  describe('error', function () {
    var ctlr, responseError, displayResponseBox;
    beforeEach(inject(function (_displayResponseBox_) {
      ctlr = LoginCtrl
      displayResponseBox = _displayResponseBox_

      // spyOn(displayResponseBox, 'populateResponseBox')

      responseError = {
        data : { errorMessage : "TEST_ERROR_MESSAGE"},

        deleteMessage : function () {
          this.data.errorMessage = null;
          return this
        },

        deleteData : function () {
          this.data = null
          return this
        }
      }
    }))
    it('should execute displayResponseBox.populateResponseBox with the error message if it exists', function () {
      spyOn(displayResponseBox, 'populateResponseBox')
      ctlr.error(responseError)
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.responseBoxConfig, responseError.data.errorMessage, true)
    })

    it('should execture displayResponseBox.populateResponseBox with te default message if there is no message in the error', function () {
      spyOn(displayResponseBox, 'populateResponseBox')
      ctlr.error(responseError.deleteMessage())
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.responseBoxConfig, "There was an unexpected error.", true)
    })

    it('should execture displayResponseBox.populateResponseBox with te default message if there is no data in the error', function () {
      spyOn(displayResponseBox, 'populateResponseBox')
      ctlr.error(responseError.deleteData())
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.responseBoxConfig, "There was an unexpected error.", true)
    })
  })

});
