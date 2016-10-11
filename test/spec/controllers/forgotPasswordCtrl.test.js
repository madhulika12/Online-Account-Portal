'use strict';

//THIS CONTROLLER IS NOT BEING USED ANYMORE

describe('Controller: forgotPasswordCtrl', function () {

  var ForgotPasswordCtrl, shared, Constants, getUrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $document, $q, $state, _getUrl_) {

    shared = this;
    shared.state = $state;
    shared.$root = $rootScope;

    shared.scope = $rootScope.$new();
    getUrl = _getUrl_;

    ForgotPasswordCtrl = $controller('forgotPasswordCtrl', {$scope: shared.scope});

    spyOn(shared.state, 'go')
  }));
  beforeEach(inject(function (_Constants_) {
    Constants = _Constants_;
  }));
  describe('regexs', function (){

    it('should place the email regex on the the email key of the controllers regex container', function () {
      var testregexs = {
        username: Constants.regexs.username
      }
      expect(ForgotPasswordCtrl.regex).toEqual(testregexs);
    });
  });

  describe('data', function () {
    it('should place an empty data obejct on the data key of the controller', function () {
      var dummyData = {
        username : null,
        url : getUrl()
      };
      expect(ForgotPasswordCtrl.forgotPasswordData).toEqual(dummyData);
    });
  });

  describe('recoverPasswordRequest', function () {
    beforeEach(inject(function ($http, $q) {
      shared.$http = $http;

      spyOn($http, 'post').and.callFake(function () {
        return $q.when()
      })

    }))
    it('should prevent the default trigger of an event', function () {
      var event = $.Event('click')
      expect(event.isDefaultPrevented()).toBeFalsy()
      ForgotPasswordCtrl.recoverPasswordRequest(event)
      shared.$root.$digest()
      expect(event.isDefaultPrevented()).toBeTruthy();

    });

    it('makes a get request to the forgotPassword endpoint with the config object it created', function () {
      var event = $.Event('click')
      var testData = {
        test : 'test1'
      }
      ForgotPasswordCtrl.forgotPasswordData = testData

      ForgotPasswordCtrl.recoverPasswordRequest(event)
      shared.$root.$digest()
      expect(shared.$http.post).toHaveBeenCalledWith(Constants.endpoints.forgotPassword, testData)
    });

    it('redirects to login', function () {
      var event = $.Event('click')
      ForgotPasswordCtrl.recoverPasswordRequest(event)
      shared.$root.$digest()
      expect(shared.state.go).toHaveBeenCalledWith('login');
    });

  });


})
