'use strict';

describe('Controller: havingTroubleCtrl', function () {

  var havingTroubleCtrl, Constants, httpService, $rootScope, displayResponseBox, $state, antiForgeryToken, tokenStorageService, $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, $document, $http, $q, _httpService_, _$state_, _displayResponseBox_, _antiForgeryToken_, _tokenStorageService_, _$httpBackend_) {
    $rootScope = _$rootScope_;
    httpService = _httpService_;
    displayResponseBox = _displayResponseBox_;
    $state = _$state_;
    antiForgeryToken = _antiForgeryToken_;
    tokenStorageService = _tokenStorageService_;
    $httpBackend = _$httpBackend_;
    havingTroubleCtrl = $controller('havingTroubleCtrl', {$scope: $rootScope.$new()})

    $httpBackend.when('GET', 'https://mws.stage.kroll.com/api/v1/security/tokens')
    .respond(200, { responseObject: {access_token: "test", refresh_token: "test"}, errorMessage: 'What now?!?' });

    // spyOn(httpService, 'forgotPassword').and.callFake(function () {
    //   return promiseMock.ret
    // })
    spyOn(httpService, "forgotPassword").and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve('Forgot Password Success');
      return deferred.promise;
    });

    spyOn($state, 'go')
    spyOn(antiForgeryToken, 'setAntiForgeryToken');
    spyOn(antiForgeryToken, 'setAntiForgeryTokenFromError');

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

  describe('forgotPassSuccess', function () {
    var mockResponse, defaultMessage;
    beforeEach(function(){
      mockResponse = { data: { responseObject: { message: "TESTING"} } };
      defaultMessage = "A password recovery email was sent to your account.";
    })
    it('should set the responseBox with the password recover message', function () {
      spyOn(displayResponseBox, 'setMessage')
      havingTroubleCtrl.forgotPassSuccess(mockResponse);
      expect(displayResponseBox.setMessage).toHaveBeenCalledWith(mockResponse.data.responseObject, false)
    })
    it('should redirect to the login page', function () {
      havingTroubleCtrl.forgotPassSuccess(mockResponse);
      expect($state.go).toHaveBeenCalledWith('login')
    })
    it('should use the default message if there is no responseObject', function () {
      spyOn(displayResponseBox, 'setMessage')
      havingTroubleCtrl.forgotPassSuccess("Nothing");
      expect(displayResponseBox.setMessage).toHaveBeenCalledWith(defaultMessage, false)
    })
    it('should setAntiForgeryToken', function () {
      havingTroubleCtrl.forgotPassSuccess(mockResponse);
      expect(antiForgeryToken.setAntiForgeryToken).toHaveBeenCalledWith(mockResponse)
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

    it('should execute displayResponseBox.populateResponseBox with the default message if there is no message in the error', function () {
      ctlr.error(responseError.deleteMessage())
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.responseBoxConfig, "There was an unexpected error.", true)
    })

    it('should execute displayResponseBox.populateResponseBox with the default message if there is no data in the error', function () {
      ctlr.error(responseError.deleteData())
      expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.responseBoxConfig, "There was an unexpected error.", true)
    })
    it('should call setAntiForgeryTokenFromError', function () {
      ctlr.error("Anything");
      expect(antiForgeryToken.setAntiForgeryTokenFromError).toHaveBeenCalledWith('Anything')
    })
  })

  describe('populateAntiForgeryToken', function () {
    it('should popluate the AntiForgeryToken into self.forgotPassData ', function() {
      var mockToken = { data: "MOCK_ANTI_FORGERY__TOKEN" };
      havingTroubleCtrl.populateAntiForgeryToken(mockToken);
      expect(havingTroubleCtrl.forgotPassData.AntiForgeryTokenId).toBe(antiForgeryToken.getAntiForgeryToken());
    })
  })

  describe('showModal', function () {
    it('should show the #havingTroubleModal', function () {
      var spyModal = spyOn( $.fn, 'modal' );
      havingTroubleCtrl.showModal()
      expect( spyModal ).toHaveBeenCalledWith( 'show' );
    })  
  })

  describe('dismissToRecoverAccount', function () {
    it('should hide the havingTroubleModal', function () {
      var spyModal = spyOn( $.fn, 'modal' );
      havingTroubleCtrl.dismissToRecoverAccount()
      expect( spyModal ).toHaveBeenCalledWith( 'hide' );
    })
    it('should add a listener to redirect once the modal is hidden', function () {
      var spyModalOn = spyOn( $.fn, 'one' );
      havingTroubleCtrl.dismissToRecoverAccount()
      expect( spyModalOn ).toHaveBeenCalled();
    })  
  })

  describe('callSecurityTokens', function () {
    it('calls refresh Cookie', function () {
      spyOn(havingTroubleCtrl, 'checkCookie');
      havingTroubleCtrl.callSecurityTokens();
      expect(havingTroubleCtrl.checkCookie).toHaveBeenCalled()
    })
  })

  describe('checkCookie', function () {
    it('calls refresh Cookie', function () {
      spyOn(tokenStorageService, 'refreshCookie');
      havingTroubleCtrl.checkCookie();
      expect(tokenStorageService.refreshCookie).toHaveBeenCalled()
    })
  })

})
