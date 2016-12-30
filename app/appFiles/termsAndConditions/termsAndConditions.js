angular.module('ssoApp')
    .controller('termsAndConditions', ['titleFactory', function(titleFactory) {
        
        var self = this;

        self.title = titleFactory.title();
    }])

    