'use strict';

//THIS CONTROLLER IS NOT BEING USED ANYMORE

describe('Controller: activationCtrl', function () {

  var ActivationCtrl, shared, Constants, httpService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, $document, $http, $q, Constants, _httpService_) {

    shared = this;
    shared.$rootScope = _$rootScope_;
    shared.Constants = Constants;



    shared.$http = $http;
    shared.scope = shared.$rootScope.$new();

    ActivationCtrl = $controller('ActivationCtrl', {$scope: shared.scope});

    httpService = _httpService_;
    spyOn(httpService, 'activate').and.callFake(function () {
      return promiseMock.ret
    })


  }));

  // describe('showError', function () {
  //   it('should set the error attribute of the controller to the first paramter passed to it', function () {
  //
  //   })
  // })

  // describe('loginRequest', function () {
  //   it('should prevent the events default trigger', function () {})
  //   it('should post the login data to the login endpoint', function () {})
  //
  // })

  // describe('positiveActivationRedirect', function () {
  //   it('redirects to...', function () {
  //     // TODO: this is currently a placeholder test. Waiting until that story to build it up
  //     ActivationCtrl.positiveActivationRedirect()
  //     expect($window.location.href).toEqual('http://localhost:8080/context.html')
  //   })
  // });

  describe('activationRequest', function () {
    it('prevents the default event', function () {
      var event = $.Event('click');
      expect(event.isDefaultPrevented()).toBeFalsy();
      ActivationCtrl.activationRequest(event);
      shared.$rootScope.$digest()
      expect(event.isDefaultPrevented()).toBeTruthy();

    })

    it('makes a post to the activate endpoint with the form data on the json key of an object', function () {
      var event = $.Event('click');

      ActivationCtrl.activationRequest(event);

      expect(httpService.activate).toHaveBeenCalledWith(ActivationCtrl.data)

    })
  })

});
