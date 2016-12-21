angular.module('ssoApp')
    .controller('mainCtrl', ['titleFactory', function(titleFactory) {
        
        var self = this;

        self.title = titleFactory.title(); 
    }])