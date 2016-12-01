'use strict';

describe('Controller: SignUpCtrl', function () {

  var SignUpCtrl, httpService, $rootScope, $window, tokenValidationService, loadBrandingService, displayResponseBox, $state, tokenStorageService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, $document, $q, _httpService_, _$window_, _tokenValidationService_, _loadBrandingService_, _displayResponseBox_, _$state_, _tokenStorageService_) {

    //create shared variables
    $rootScope = _$rootScope_;
    $window = _$window_;
    loadBrandingService = _loadBrandingService_;
    tokenValidationService = _tokenValidationService_;
    httpService = _httpService_;
    displayResponseBox = _displayResponseBox_;
    $state = _$state_;
    tokenStorageService = _tokenStorageService_;

    //create mocks
    // spyOn(httpService, 'signUp').and.callFake(function () {
    //   return promiseMock.ret
    // })
    spyOn(httpService, "signUp").and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve('signUp Success');
      return deferred.promise;
    });
    spyOn(tokenValidationService, 'checkTokenAndRedirect').and.callFake(function () {
      return $q.resolve()
    })
    spyOn(httpService, 'getMember').and.callFake(function () {
      return $q.resolve({data : {}})
    })

    //instantiate controller
    SignUpCtrl = $controller('signUpCtrl', { $scope: $rootScope.$new() });
  }));

  describe('sendSignUpRequest', function () {
    it('should call the httpService.signUp method with the signUp data', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();

      SignUpCtrl.sendSignUpRequest(event)

      expect(httpService.signUp).toHaveBeenCalledWith(SignUpCtrl.data)
    });

    describe('on positive response, positiveSignUpRedirect', function () {
      it('should redirect to the ice portal', function () {
        spyOn($window.location, 'assign')
        var mockResponse = { data : { responseObject : "URL_TEST" } };

        SignUpCtrl.positiveSignUpRedirect(mockResponse);

        expect($window.location.assign).toHaveBeenCalledWith(loadBrandingService._styles.pingURL + mockResponse.data.responseObject)
      })
    })

    describe('on negative response, invalidTokenError', function () {
      var testResponseError;
      beforeEach(function () {
        spyOn(displayResponseBox, 'setMessage')

        testResponseError = {
          data : { errorMessage : "TEST_ERROR_MESSAGE" } ,
        }
      })

      it('should execute displayResponseBox.setMessage with the error message if it exists', function () {
        SignUpCtrl.invalidTokenError(testResponseError)
        expect(displayResponseBox.setMessage).toHaveBeenCalledWith(testResponseError.data.errorMessage, true)
      })

      it('should execute displayResponseBox.setMessage with the default message if there is no message in the error', function () {
        testResponseError.data = { errorMessage: undefined };
        SignUpCtrl.invalidTokenError(testResponseError)
        expect(displayResponseBox.setMessage).toHaveBeenCalledWith("There was an unexpected error.", true)
      })

      it('should execute redirect to login', function () {
        spyOn($state, 'go');
        SignUpCtrl.invalidTokenError(testResponseError)
        expect($state.go).toHaveBeenCalledWith("login");
      })
    })

  });

  describe('on error', function () {
    it('should execute displayResponseBox.populateResponseBox with the error message if it exists', function () {
      var mockError = { data : { errorMessage : "TEST_ERROR_MESSAGE" } };
      spyOn(displayResponseBox, 'populateResponseBox')
      SignUpCtrl.error(mockError)
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(SignUpCtrl.responseBoxConfig, mockError.data.errorMessage, true)
    })

    it('should execute displayResponseBox.populateResponseBox with the default message if there is no message in the error', function () {
      var mockError = { data : {} };
      spyOn(displayResponseBox, 'populateResponseBox')
      SignUpCtrl.error(mockError)
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(SignUpCtrl.responseBoxConfig, "There was an unexpected error.", true)
    })
  })

  describe('setViewAndRender', function () {
    var mockModelController;
    var mockData = {};
    beforeEach(function(){
      mockModelController = jasmine.createSpyObj('mockModelController', ['$setViewValue', '$render', '$validate']);
    })
    it('should set the view value with the modelCtrl passed to it', function () {
      SignUpCtrl.setViewAndRender(mockModelController, mockData);
      expect(mockModelController.$setViewValue).toHaveBeenCalledWith(mockData)
    })
    it('should run the modelCtrl\'s $render method', function () {
      SignUpCtrl.setViewAndRender(mockModelController, mockData);
      expect(mockModelController.$render).toHaveBeenCalled();
    })
    it('should run the modelCtrl\'s $validate method', function () {
      SignUpCtrl.setViewAndRender(mockModelController, mockData);
      expect(mockModelController.$validate).toHaveBeenCalled();
    })
  })

  describe('populateForm', function () {
    beforeEach(function(){
      spyOn(SignUpCtrl, 'setViewAndRender');
      SignUpCtrl.form = {};
    })
    it('should execute setViewAndRender with the individual data points passed to it', function () {
      var mockUserData = { data: { responseObject: { id: 9000 } } };
      var inputsRendered = ["Dob", "Phone", "FirstName", "LastName", "Generation", "MailingAddress", "City", "State", "ZipCode", "Email"]
      SignUpCtrl.populateForm(mockUserData);
      expect(SignUpCtrl.setViewAndRender.calls.count()).toBe(inputsRendered.length)
    })
    it('should assign the MemberId based on the response object', function () {
      var mockUserData = { data: { responseObject: { id: 9000 } } };
      SignUpCtrl.populateForm(mockUserData);
      expect(SignUpCtrl.data.MemberId).toBe(9000)
    })
    it('should do nothing if response data is missing', function () {
      var mockUserData = { data: {} };
      SignUpCtrl.populateForm(mockUserData);
      expect(SignUpCtrl.data.MemberId).toBe(null)
    })
  })

  describe('populateAntiForgeryToken', function () {
    var mockToken, storedToken;
    beforeEach(function(){
      mockToken = { data: "MOCK_ANTI_FORGERY_TOKEN" };
      storedToken = tokenStorageService.getToken();
      spyOn(SignUpCtrl, 'sendRequestToPopulate')
    })

    it('should populate the AntiForgeryToken into self.data ', function() {
      SignUpCtrl.populateAntiForgeryToken(mockToken);
      expect(SignUpCtrl.data.AntiForgeryTokenId).toBe(mockToken.data);
    })
    it('should populate the AntiForgeryToken into self.dataToPopulateForm ', function() {
      SignUpCtrl.populateAntiForgeryToken(mockToken);
      expect(SignUpCtrl.dataToPopulateForm.AntiForgeryTokenId).toBe(mockToken.data);
    })
    it('should populate the storedToken into self.data.SessionId ', function() {
      SignUpCtrl.populateAntiForgeryToken(mockToken);
      expect(SignUpCtrl.data.SessionId).toBe(storedToken);
    })
    it('should populate the storedToken into self.dataToPopulateForm.SessionId ', function() {
      SignUpCtrl.populateAntiForgeryToken(mockToken);
      expect(SignUpCtrl.dataToPopulateForm.SessionId).toBe(storedToken);
    })
    it('should call sendRequestToPopulate ', function() {
      SignUpCtrl.populateAntiForgeryToken(mockToken);
      expect(SignUpCtrl.sendRequestToPopulate).toHaveBeenCalled();
    })
  })

  describe('sendRequestToPopulate', function () {
    it('should call httpService.getMember with the dataToPopulateForm then either populate the form or error', function() {
      SignUpCtrl.sendRequestToPopulate();
      expect(httpService.getMember).toHaveBeenCalledWith(SignUpCtrl.dataToPopulateForm);
    })

  })

});
