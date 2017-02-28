angular.module('ssoApp')

    .controller('footerCtrl', ['$scope', 'contentService', '$location', 'getClient','loadBrandingService', '$http', 'Constants', '$state', '$window', 'httpService', 'displayResponseBox', 'tokenValidationService', 'tokenStorageService', function ($scope, contentService, $location, getClient,         loadBrandingService, $http, Constants, $state, $window, httpService, displayResponseBox, tokenValidationService, tokenStorageService){
        
        var self = this;

        $scope.interchangableComponents = contentService._content;
}])
