angular.module('ssoApp')
    .controller('mainCtrl', ['titleFactory', '$scope', function(titleFactory, $scope) {
        
        var self = this;

        self.title = titleFactory.title(); 

        $scope.titleFactory = titleFactory;
    }])