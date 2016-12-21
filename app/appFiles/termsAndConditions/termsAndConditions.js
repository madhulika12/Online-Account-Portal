angular.module('ssoApp')
    .controller('termsAndConditions', ['titleFactory', function(titleFactory) {
        
        var self = this;
        
        titleFactory.setTitle("PRIMERICA's Portal - Terms and Conditions")

        self.title = titleFactory.title();
    }])

    