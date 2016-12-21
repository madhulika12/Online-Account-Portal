angular.module('ssoApp')
    .factory('titleFactory', ['$http', function ($http) {
        
        var title = "PRIMERICA's Portal - Sign In";

        return {
            title: function() { return title; },
            setTitle: function(newTitle) { title = newTitle; }
        };
}])