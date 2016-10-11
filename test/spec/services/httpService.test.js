'use strict';

describe('Service: httpService', function () {

  var Constants, testData, expectRequest, $httpBackend, httpService, testData;

  beforeEach(inject(function (_Constants_, _$httpBackend_, _httpService_) {
    Constants = _Constants_;

    var testData = {
      test : "TEST123"
    }

    $httpBackend = _$httpBackend_;
    httpService = _httpService_;


    expectRequest = function (method, url, data) {
      $httpBackend.when(method, url).respond({ data : { responseObject : "TEST_RESPONSE"}})
      $httpBackend.expect(method, url, data, { 'Content-Type' : 'application/x-www-form-urlencoded', 'Accept':'application/json, text/plain, */*'})
    }

  }));
  describe('activate', function () {
    it('should fire a POST to the activate endpoint with the data', function () {
      expectRequest('POST', Constants.endpoints.activate, testData)
      httpService.activate(testData)
      $httpBackend.flush()
    })
  })
  describe('login', function () {
    it('should fire a POST to the login endpoint with the data', function () {
      expectRequest('POST', Constants.endpoints.login, testData)
      httpService.login(testData)
      $httpBackend.flush()
    })
  })
  describe('recoverAccount', function () {
    it('should fire a POST to the recoverAccount endpoint with the data', function () {
      expectRequest('POST', Constants.endpoints.recoverAccount, testData)
      httpService.recoverAccount(testData)
      $httpBackend.flush()
    })
  })
  describe('validate', function () {
    it('should fire a GET to the getMemberByToken endpoint with the data', function () {
      expectRequest('GET', Constants.endpoints.getMemberByToken, testData)
      httpService.validate(testData)
      $httpBackend.flush()
    })
  })
  describe('signUp', function () {
    it('should fire a POST to the signUp endpoint with the data', function () {
      expectRequest('POST', Constants.endpoints.signUp, testData)
      httpService.signUp(testData)
      $httpBackend.flush()
    })
  })
  describe('changePassword', function () {
    it('should fire a POST to the changePassword endpoint with the data', function () {
      expectRequest('POST', Constants.endpoints.changePassword, testData)
      httpService.changePassword(testData)
      $httpBackend.flush()
    })
  })
  describe('setPassword', function () {
    it('should fire a POST to the setPassword endpoint with the data', function () {
      expectRequest('POST', Constants.endpoints.setPassword, testData)
      httpService.setPassword(testData)
      $httpBackend.flush()
    })
  })
  describe('updateEmail', function () {
    it('should fire a POST to the updateEmail endpoint with the data', function () {
      expectRequest('POST', Constants.endpoints.updateEmail, testData)
      httpService.updateEmail(testData)
      $httpBackend.flush()
    })
  })
  describe('forgotPassword', function () {
    it('should fire a GET to the forgotPassword endpoint with the data', function () {
      expectRequest('POST', Constants.endpoints.forgotPassword, testData)
      httpService.forgotPassword(testData)
      $httpBackend.flush()
    })
  })
  describe('acceptTerms', function () {
    it('should fire a POST to the acceptTerms endpoint with the data', function () {
      expectRequest('POST', Constants.endpoints.acceptTerms, testData)
      httpService.acceptTerms(testData)
      $httpBackend.flush()
    })
  })
  describe('firstTimeActivate', function () {
    it('should fire a POST to the firstTimeActivate endpoint with the data', function () {
      expectRequest('POST', Constants.endpoints.firstTimeActivate, testData)
      httpService.firstTimeActivate(testData)
      $httpBackend.flush()
    })
  })
  describe('forgotUsername', function () {
    it('should fire a POST to the forgotUsername endpoint with the data', function () {
      expectRequest('POST', Constants.endpoints.forgotUsername, testData)
      httpService.forgotUsername(testData)
      $httpBackend.flush()
    })
  })

  describe('getMember', function () {
    it('should fire a GET to the getMember endpoint with the data', function () {
      expectRequest('GET', Constants.endpoints.getMemberByToken, testData)
      httpService.getMember(testData)
      $httpBackend.flush()
    })
  })

  describe('emailExist', function () {
    it('should fire a GET to the emailExist endpoint with the data', function () {
      var test = { 'email' : testData }
      expectRequest('GET', Constants.endpoints.emailExist + '?email=%7B%7D', testData)
      httpService.emailExist(test)
      $httpBackend.flush()
    })
  })

  describe('usernameExist', function () {
    it('should fire a GET to the usernameExist endpoint with the data', function () {
      var test = { 'userid' : testData }
      expectRequest('GET', Constants.endpoints.usernameExist + '?userid=%7B%7D', testData)
      httpService.usernameExist(test)
      $httpBackend.flush()
    })
  })
});
