'use strict';

describe('Controller: LoginCtrl', function () {

  var LoginCtrl, httpService, $rootScope, positiveActivate, httpError, $location, tokenStorageService, $state, $window, loadBrandingService, antiForgeryToken;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$state_, $q, _httpService_, _$rootScope_, _$location_, _$window_, _tokenStorageService_, _loadBrandingService_, _antiForgeryToken_) {

    //set shared variables
    $rootScope = _$rootScope_;
    httpService = _httpService_;
    $location = _$location_;
    tokenStorageService = _tokenStorageService_;
    $state = _$state_;
    $window = _$window_;
    loadBrandingService = _loadBrandingService_;
    antiForgeryToken = _antiForgeryToken_;

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
    spyOn($state, 'go');
    spyOn(antiForgeryToken, 'setAntiForgeryToken');
    spyOn(antiForgeryToken, 'setAntiForgeryTokenFromError');

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

  // Code in controller is currently commented out. 
  // xdescribe('on instantiation', function () {
  //   it('should check for a stored response box message and set it on the responseBoxConfig key', function () {
  //     //TODO now
  //   })
  // })

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

  describe('activationSuccess', function () {
      var mockToken;
      beforeEach(function(){
        mockToken = { data: { responseObject: "TEST_TOKEN" } };
        spyOn(tokenStorageService, 'setToken');
      })
    it('should store the string provided by the response object using token storage service', function () {
      LoginCtrl.activationSuccess(mockToken);
      expect(tokenStorageService.setToken).toHaveBeenCalledWith(mockToken.data.responseObject);
    })

    it('should change the state to sign-up', function () {
      LoginCtrl.activationSuccess(mockToken);
      expect($state.go).toHaveBeenCalledWith("sign-up");
    })

    it('should set the antiForgeryToken', function () {
      LoginCtrl.activationSuccess(mockToken);
      expect(antiForgeryToken.setAntiForgeryToken).toHaveBeenCalledWith(mockToken);
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

  describe('loginSuccess', function () {
    var mockData;
    beforeEach(function(){
      mockData = { 
        data: { 
          errorType: 200,
          responseObject: {
            sessionToken: "TEST_SESSION",
            pingToken: "TEST_PING"
          }
        }
      };

      spyOn(tokenStorageService, 'setToken');
      spyOn($location, 'url');
    })
    it('should store the sessionToken if the errortype is 200', function () {
      LoginCtrl.loginSuccess(mockData);
      expect(tokenStorageService.setToken).toHaveBeenCalledWith(mockData.data.responseObject.sessionToken);
    })

    it('should assign the window location based on the ping-token if checkForTerms is not triggered', function () {
      spyOn($window.location, 'assign');
      LoginCtrl.loginSuccess(mockData);
      expect($window.location.assign).toHaveBeenCalledWith(loadBrandingService._styles.pingURL + mockData.data.responseObject.pingToken);
    })

    it('should redirect the page if the pingToken contains terms-accept', function () {
      var checkThis = "terms-accept";
      mockData.data.responseObject.pingToken = checkThis;
      LoginCtrl.loginSuccess(mockData);
      expect($location.url).toHaveBeenCalledWith(checkThis);
    })

    it('should redirect the page if the pingToken contains terms-accept and account-activation', function () {
      var checkThis = "account-activation";
      mockData.data.responseObject.pingToken = checkThis;
      var answer = mockData.data.responseObject.pingToken + "?token=" + mockData.data.responseObject.sessionToken;
      
      LoginCtrl.loginSuccess(mockData);

      expect($location.url).toHaveBeenCalledWith(answer);
    })

    it('should do nothing if the errortype is not 200', function () {
      mockData.data.errorType = 500;
      LoginCtrl.loginSuccess(mockData);
      expect(tokenStorageService.setToken).not.toHaveBeenCalled();
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

    it('should follow the location described by the pingToken if it exists', function () {
      responseError.data.responseObject = { pingToken: "TEST" };
      spyOn($location, 'url');
      ctlr.error(responseError);
      expect($location.url).toHaveBeenCalledWith(responseError.data.responseObject.pingToken);
    })

    it('should set the antiForgeryToken', function () {
      ctlr.error(responseError);
      expect(antiForgeryToken.setAntiForgeryTokenFromError).toHaveBeenCalledWith(responseError);
    })
  })

  describe('checkForTerms', function () {
    it('should return an answer of  whether the pingToken equals terms-accept', function () {
      var testingFor = "terms-accept";
      var mockResponse = { data: { responseObject: { pingToken: testingFor } } };
      var answer = LoginCtrl.checkForTerms(mockResponse);
      expect(answer).toBeTruthy();
    })

    it('should be null if it does not match terms-accept', function () {
      var testingFor = "yarp";
      var mockResponse = { data: { responseObject: { pingToken: testingFor } } };
      var answer = LoginCtrl.checkForTerms(mockResponse);
      expect(answer).toBeFalsy();
    })
  })

  describe('checkForAccountActivation', function () {
    it('should return an answer of  whether the pingToken equals account-activation', function () {
      var testingFor = "account-activation";
      var mockResponse = { data: { responseObject: { pingToken: testingFor } } };
      var answer = LoginCtrl.checkForAccountActivation(mockResponse);
      expect(answer).toBeTruthy();
    })

    it('should be null if it does not match account-activation', function () {
      var testingFor = "yarp";
      var mockResponse = { data: { responseObject: { pingToken: testingFor } } };
      var answer = LoginCtrl.checkForAccountActivation(mockResponse);
      expect(answer).toBeFalsy();
    })
  })

  describe('populateAntiForgeryToken', function () {
    var mockToken;
    beforeEach(function(){
      mockToken = { data: "MOCK_ANTI_FORGERY_TOKEN" };
      spyOn(LoginCtrl, 'clearCookie');
    })
    it('should clear the cookies', function () {
      LoginCtrl.populateAntiForgeryToken(mockToken);
      expect(LoginCtrl.clearCookie).toHaveBeenCalled();
    })
    it('should popluate the AntiForgeryToken into self.signUpData ', function() {
      LoginCtrl.populateAntiForgeryToken(mockToken);
      expect(LoginCtrl.signUpData.AntiForgeryTokenId).toBe(antiForgeryToken.getAntiForgeryToken());
    })
    it('should populate the AntiForgeryToken into self.loginData ', function() {
      LoginCtrl.populateAntiForgeryToken(mockToken);
      expect(LoginCtrl.loginData.AntiForgeryTokenId).toBe(antiForgeryToken.getAntiForgeryToken());
    })
    it('should set the antiForgeryToken', function () {
      LoginCtrl.populateAntiForgeryToken(mockToken);
      expect(antiForgeryToken.setAntiForgeryToken).toHaveBeenCalledWith(mockToken)
    })
  })

  describe('clearCookie', function () {
    it('calls refresh Cookie', function () {
      spyOn(tokenStorageService, 'deleteToken');
      LoginCtrl.clearCookie();
      expect(tokenStorageService.deleteToken).toHaveBeenCalled()
    })
  })

});
