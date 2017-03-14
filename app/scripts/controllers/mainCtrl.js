angular.module('ssoApp')
    .controller('mainCtrl', ['titleFactory', '$scope', function(titleFactory, $scope) {
        
        var self = this;

        self.title = titleFactory; 

        $scope.titleFactory = titleFactory;
    }])