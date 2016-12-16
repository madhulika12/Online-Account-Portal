'use strict';

describe('Controller: headerCtrl', function () {

  var HeaderCtrl, tokenStorageService, $rootScope, $location;

  beforeEach(inject(function ($controller, _$rootScope_, $document, $http, $q, _tokenStorageService_, _$location_) {
    tokenStorageService = _tokenStorageService_;
    $rootScope = _$rootScope_;
    $location = _$location_;

    HeaderCtrl = $controller('headerCtrl', {$scope: $rootScope.$new()});

  }));

  describe('init value', function () {
    it('should start with homeLink being /#/login', function () {
      var defaultHomeLink = '/#/login';
      expect(HeaderCtrl.homeLink).toEqual(defaultHomeLink);
    })
  })

  describe('changeHref', function () {
    it('should start with homeLink being /#/login', function () {
      var defaultHomeLink = '/#/login';
      HeaderCtrl.changeHref()
      expect(HeaderCtrl.homeLink).toEqual(defaultHomeLink);
    })
    it('should change the homeLink if you are on the member/profile path', function () {
      var newHomeLink = 'http://imc2-staging2.csid.com/dashboard';
      $location.path('/member/profile');
      HeaderCtrl.changeHref()
      expect(HeaderCtrl.homeLink).toEqual(newHomeLink);
    })
  })

});
