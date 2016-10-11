'use strict';

describe('Controller: linkElement', function () {

  var linkElement, shared, testStyles, loadBrandingService, $rootScope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, $q, _loadBrandingService_) {

    $rootScope = _$rootScope_
    loadBrandingService = _loadBrandingService_

    spyOn(loadBrandingService, 'getStyleSheetPromise').and.callFake(function () {
      return $q.resolve()
    })
    spyOn(loadBrandingService, 'getStyles').and.callFake(function () {
      testStyles = "test123"
      return testStyles
    })

    linkElement = $controller('linkElement', {$scope : $rootScope.$new()})
  }))

  describe("instantiation", function () {
    it("should call the loadbrandingservice getStyles and set the result to the styles key", function () {
      $rootScope.$digest()
      expect(loadBrandingService.getStyles).toHaveBeenCalled()
      expect(linkElement.styles).toEqual(testStyles)
    })
  })
})
