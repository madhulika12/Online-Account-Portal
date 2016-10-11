'use strict';

describe('Service: loadBrandingService', function () {

  var shared, loadBrandingService;

  beforeEach(inject(function ($rootScope, $http, $location, _loadBrandingService_, $q) {

    shared = this;

    shared.$http = $http;
    shared.$location = $location;
    shared.root = $rootScope;

    loadBrandingService = _loadBrandingService_;

    shared.requestErrorFlag = "none"

    shared.goodResponse = {
      data : {
        responseObject : {
          url : "www.test.com",
          favicon : "test.ico",
          title : "ABC123",
          logo : "test/logo.png"
        }
      }
    };

    var dummyResponse = function () {
      switch (shared.requestErrorFlag) {
        case "none":
          return shared.goodResponse
        case "404":
          return {
            data : {
              errorType : 404
            }
          };
        case "noObject":
          return {
            data : {
              test : "ABC123"
            }
          }
      }
    }

    shared.resolve = true;


    spyOn($http, 'get').and.callFake(function () {
      return (shared.resolve) ? $q.resolve(dummyResponse()) : $q.reject();
    })

    spyOn(loadBrandingService, 'getBaseUrl').and.callThrough()

  }));

  describe('getStyleSheetPromise', function () {
    it('should return the object stored on the promise key', function () {
      loadBrandingService.promise = "DUMMY_PROMISE_123"
      expect(loadBrandingService.getStyleSheetPromise()).toEqual("DUMMY_PROMISE_123")

    })
  })

  describe('getStyles', function () {

    it('should return the object stored on the _styles key', function () {

      var test = {
        test : '123ABC'
      }

      loadBrandingService._styles = test
      expect( loadBrandingService.getStyles() ).toEqual(test)

    })
  })

  describe('getStyleSheetPath', function () {
    it('should run the service.getBaseUrl function', function () {
      loadBrandingService.getStyleSheetPath()
      expect(loadBrandingService.getBaseUrl).toHaveBeenCalled()
    })
    it('should make a get request to the webpage attributes endpoint', function () {
      loadBrandingService.getStyleSheetPath()
      expect(shared.$http.get).toHaveBeenCalledWith('https://mws.stage.kroll.com/api/v1/vendor/webpage-attributes?url=' + shared.$location.host())
    })
    describe('on a positive response', function () {
      it('if the response has a 404 errorType, it should set the styles with default', function () {
        shared.requestErrorFlag = "404";
        loadBrandingService.getStyleSheetPath()
        shared.root.$digest()
        expect(loadBrandingService._styles).toEqual(loadBrandingService._defaultStyles)

      })

      it('if the response has no responseObject, it should set the styles with default', function () {
        shared.requestErrorFlag = "noObject";
        loadBrandingService.getStyleSheetPath();
        shared.root.$digest()
        expect(loadBrandingService._styles).toEqual(loadBrandingService._defaultStyles)
      })

      it('if the response doesnt have a 404 responsetype, and has a response object, it should set the styles with the response object', function () {
        shared.requestErrorFlag = "none";
        loadBrandingService.getStyleSheetPath();
        shared.root.$digest()
        expect(loadBrandingService._styles).toEqual(shared.goodResponse.data.responseObject)


      })
    })
    describe('on a negative response', function () {
      it('should run the set the styles with the default styling', function () {
        shared.resolve = false;
        loadBrandingService.getStyleSheetPath();
        shared.root.$digest()
        expect(loadBrandingService._styles).toEqual(loadBrandingService._defaultStyles)
      })
    })
  });


});
