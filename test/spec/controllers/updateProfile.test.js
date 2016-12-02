'use strict';

describe('Controller: updateProfileCtrl', function () {

  var UpdateProfileCtrl, httpService, $rootScope, $state, displayResponseBox, tokenStorageService;

  var dummyResponse = {
    data : {
      responseObject : {
        firstName : "TESTER",
        lastName : "NUMBER_ONE",
        suffix : "JR",
        address1 : "123 Fake Drive",
        city : "Townsville",
        stateProvince : "TN",
        postalCode : "12345",
        dob : "11/11/1911",
        email : "abc@123.com",
        homePhone : "1234567890"
      }
    }
  }

  var current = {
    FirstName : "TESTER",
    LastName : "NUMBER_ONE",
    Generation : "JR",
    MailingAddress : "123 Fake Drive",
    City : "Townsville",
    State : "TN",
    ZipCode : "12345",
    DateOfBirth : "11/11/1911",
    Email : "abc@123.com",
    PhoneNumber : "1234567890",
    SessionId : undefined,
    AntiForgeryTokenId :  undefined
  }

  var emptyData = {
    FirstName : null,
    LastName : null,
    Generation : null,
    MailingAddress : null,
    City : null,
    State : null,
    ZipCode : null,
    DateOfBirth : null,
    Email : null,
    PhoneNumber : null,
    SessionId : null,
    AntiForgeryTokenId :  null
  }

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _httpService_, _$state_, _displayResponseBox_, _tokenStorageService_) {
    //create shared variables
    $rootScope = _$rootScope_
    httpService = _httpService_
    $state = _$state_
    displayResponseBox = _displayResponseBox_
    tokenStorageService = _tokenStorageService_;


    //create mocks
    spyOn(httpService, 'updateProfile').and.callFake(function () {
      return promiseMock.ret
    })
    spyOn(httpService, 'changePassword').and.callFake(function () {
      return promiseMock.ret
    })
    spyOn(httpService, 'getMember').and.callFake(function () {
      return promiseMock.ret
    })
    spyOn($state, 'go')
    spyOn(displayResponseBox, 'populateResponseBox')

    //instantiate controller
    UpdateProfileCtrl = $controller('updateProfile', {$scope: $rootScope.$new()})
    spyOn(UpdateProfileCtrl, 'setUpdatedDataAsOld').and.callThrough()

  }));

  // This was changed for the signup
  // describe('on instantiation', function () {
  //   it('should redirect to login if there is no token', function () {
  //     $rootScope.$digest()
  //     expect($state.go).toHaveBeenCalled()
  //   })
  // })

  describe('setting Data', function () {
    describe('#setData', function () {
      it('should do nothing if no data is passed to it', function () {
        UpdateProfileCtrl.setData({ data: {} })
        expect(UpdateProfileCtrl.setUpdatedDataAsOld).not.toHaveBeenCalled();
      })
    })

    describe('#setData', function () {
      it('should set data that is passed to it', function () {
        UpdateProfileCtrl.setData(dummyResponse)
        expect(UpdateProfileCtrl.currentData).toEqual(current)
      })
    })

    describe('#setUpdateDataAsOld', function () {
      it('should put a copy of old data as updatedData', function () {
        UpdateProfileCtrl.setData(dummyResponse)
        expect(UpdateProfileCtrl.setUpdatedDataAsOld).toHaveBeenCalled()
        expect(UpdateProfileCtrl.updatedData).toEqual(current)
      })
    })

  })

  describe('#editOn', function () {
    it('should set the mode to edit', function () {
      UpdateProfileCtrl.editOn()
      expect(UpdateProfileCtrl.mode).toEqual('edit')
    })
  })

  describe('#passwordMode', function () {
    it('should set the editPasswordMode to change', function () {
      UpdateProfileCtrl.passwordMode()
      expect(UpdateProfileCtrl.editPasswordMode).toEqual('change')
    })
  })

  describe('#cancel', function () {
    it('should set the updated data to the old data', function () {
      UpdateProfileCtrl.setData(dummyResponse)
      UpdateProfileCtrl.updatedData = {}

      UpdateProfileCtrl.cancel()
      expect(UpdateProfileCtrl.updatedData).toEqual(current)
    })

    it('should set the mode to view', function () {
      UpdateProfileCtrl.cancel()
      expect(UpdateProfileCtrl.mode).toEqual('view')
    })
  })

  describe('#cancelPassword', function () {
    it('should set the editPasswordMode to show', function () {
      UpdateProfileCtrl.cancelPassword()
      expect(UpdateProfileCtrl.editPasswordMode).toEqual('show')
    })
  })

  describe('updating personal info', function () {
    describe('#saveError', function () {
      var ctlr, responseError;
      beforeEach(inject(function (_displayResponseBox_) {
        ctlr = UpdateProfileCtrl

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
        ctlr.saveError(responseError)
        expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.saveResponseBox, responseError.data.errorMessage, true)
      })

      it('should execute displayResponseBox.populateResponseBox with the default message if there is no message in the error', function () {
        ctlr.saveError(responseError.deleteMessage())
        expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.saveResponseBox, "There was an unexpected error - Update Profile.", true)
      })

      it('should execute displayResponseBox.populateResponseBox with the default message if there is no data in the error', function () {
        ctlr.saveError(responseError.deleteData())
        expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.saveResponseBox, "There was an unexpected error - Update Profile.", true)
      })
    })

    describe('#saveSuccess', function () {
      it('should call populateResponseBox', function () {
        UpdateProfileCtrl.saveSuccess()
        expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(UpdateProfileCtrl.saveResponseBox, "Your information was successfully updated!", false)
      })
    })

    describe('#save', function () {
      it('should call httpService.updateProfile', function () {
        UpdateProfileCtrl.save()
        expect(httpService.updateProfile).toHaveBeenCalledWith(emptyData)
      })
    })
  })

  describe('updating password', function () {
    describe('#setPassError', function () {
      var ctlr, responseError;
      beforeEach(inject(function (_displayResponseBox_) {
        ctlr = UpdateProfileCtrl

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
        ctlr.setPassError(responseError)
        expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.resetPassResponseBox, responseError.data.errorMessage, true)
      })

      it('should execute displayResponseBox.populateResponseBox with the default message if there is no message in the error', function () {
        ctlr.setPassError(responseError.deleteMessage())
        expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.resetPassResponseBox, "There was an unexpected error.", true)
      })

      it('should execute displayResponseBox.populateResponseBox with the default message if there is no data in the error', function () {
        ctlr.setPassError(responseError.deleteData())
        expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(ctlr.resetPassResponseBox, "There was an unexpected error.", true)
      })
    })

    describe('#setPassSuccess', function () {
      it('should call populateResponseBox', function () {

        UpdateProfileCtrl.setPassSuccess()
        expect(displayResponseBox.populateResponseBox).toHaveBeenCalledWith(UpdateProfileCtrl.resetPassResponseBox, "Your information was successfully updated!", false)

      })

    })
    describe('#setNewPassword', function () {
      it('should call httpService.changePassword', function () {
        UpdateProfileCtrl.setNewPassword()
        expect(httpService.changePassword).toHaveBeenCalledWith(UpdateProfileCtrl.resetPassData)
      })
    })
  })

  describe('setViewAndRender', function () {
    var mockModelController;
    var mockData = {};
    beforeEach(function(){
      mockModelController = jasmine.createSpyObj('mockModelController', ['$setViewValue', '$render', '$validate']);
    })
    it('should set the view value with the modelCtrl passed to it', function () {
      UpdateProfileCtrl.setViewAndRender(mockModelController, mockData);
      expect(mockModelController.$setViewValue).toHaveBeenCalledWith(mockData)
    })
    it('should run the modelCtrl\'s $render method', function () {
      UpdateProfileCtrl.setViewAndRender(mockModelController, mockData);
      expect(mockModelController.$render).toHaveBeenCalled();
    })
    it('should run the modelCtrl\'s $validate method', function () {
      UpdateProfileCtrl.setViewAndRender(mockModelController, mockData);
      expect(mockModelController.$validate).toHaveBeenCalled();
    })
  })

  describe('populateForm', function () {
    beforeEach(function(){
      spyOn(UpdateProfileCtrl, 'setViewAndRender');
      UpdateProfileCtrl.form = {};
    })
    it('should execute setViewAndRender with the individual data points passed to it', function () {
      var inputsRendered = ["Dob", "Phone", "FirstName", "LastName", "Generation", "MailingAddress", "City", "State", "ZipCode", "Email"]
      UpdateProfileCtrl.populateForm(dummyResponse);
      expect(UpdateProfileCtrl.setViewAndRender.calls.count()).toBe(inputsRendered.length)
    })

    it('should update all the data if there is a data.responseObject', function () {
      UpdateProfileCtrl.populateForm(dummyResponse);
      expect(UpdateProfileCtrl.updatedData.DateOfBirth).toBe(current.DateOfBirth)
      expect(UpdateProfileCtrl.updatedData.PhoneNumber).toBe(current.PhoneNumber)
      expect(UpdateProfileCtrl.updatedData.FirstName).toBe(current.FirstName)
      expect(UpdateProfileCtrl.updatedData.LastName).toBe(current.LastName)
      expect(UpdateProfileCtrl.updatedData.Generation).toBe(current.Generation)
      expect(UpdateProfileCtrl.updatedData.MailingAddress).toBe(current.MailingAddress)
      expect(UpdateProfileCtrl.updatedData.City).toBe(current.City)
      expect(UpdateProfileCtrl.updatedData.State).toBe(current.State)
      expect(UpdateProfileCtrl.updatedData.ZipCode).toBe(current.ZipCode)
      expect(UpdateProfileCtrl.updatedData.Email).toBe(current.Email)
    }) 

    it('should do nothing if response data is missing', function () {
      var mockUserData = { data: {} };
      UpdateProfileCtrl.populateForm(mockUserData);
      expect(UpdateProfileCtrl.updatedData.Email).toBe(undefined)
    })
  })

  describe('populateAntiForgeryToken', function () {
    var mockToken, mockStoredToken;
    beforeEach(function(){
      mockToken = { data: "MOCK_ANTI_FORGERY__TOKEN" };
      mockStoredToken = tokenStorageService.getToken();
    }) 
    it('should populate the AntiForgeryToken into self.dataToPopulateForm', function() {
      UpdateProfileCtrl.populateAntiForgeryToken(mockToken);
      expect(UpdateProfileCtrl.dataToPopulateForm.AntiForgeryTokenId).toBe(mockToken.data);
    })
    it('should populate the AntiForgeryToken into self.updatedData', function() {
      UpdateProfileCtrl.populateAntiForgeryToken(mockToken);
      expect(UpdateProfileCtrl.updatedData.AntiForgeryTokenId).toBe(mockToken.data);
    })
    it('should populate the AntiForgeryToken into self.resetPassData', function() {
      UpdateProfileCtrl.populateAntiForgeryToken(mockToken);
      expect(UpdateProfileCtrl.resetPassData.AntiForgeryTokenId).toBe(mockToken.data);
    })

    it('should populate the SessionId into self.dataToPopulateForm', function() {
      UpdateProfileCtrl.populateAntiForgeryToken(mockToken);
      expect(UpdateProfileCtrl.dataToPopulateForm.SessionId).toBe(mockStoredToken);
    })
    it('should populate the SessionId into self.updatedData', function() {
      UpdateProfileCtrl.populateAntiForgeryToken(mockToken);
      expect(UpdateProfileCtrl.updatedData.SessionId).toBe(mockStoredToken);
    })
    it('should populate the SessionId into self.resetPassData', function() {
      UpdateProfileCtrl.populateAntiForgeryToken(mockToken);
      expect(UpdateProfileCtrl.resetPassData.SessionId).toBe(mockStoredToken);
    })

    it('should call sendRequestToPopulate', function() {
      spyOn(UpdateProfileCtrl, 'sendRequestToPopulate');
      UpdateProfileCtrl.populateAntiForgeryToken(mockToken);
      expect(UpdateProfileCtrl.sendRequestToPopulate).toHaveBeenCalled();
    })
  })

  describe('sendRequestToPopulate', function () {
    it('should call httpService.getMember', function () {
      UpdateProfileCtrl.sendRequestToPopulate()
      expect(httpService.getMember).toHaveBeenCalledWith(UpdateProfileCtrl.dataToPopulateForm)
    })
  })
})
