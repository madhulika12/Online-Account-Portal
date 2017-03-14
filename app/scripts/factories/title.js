angular.module('ssoApp')
    .factory('titleFactory', ['Constants', '$state', '$http', function (Constants, $state, $http) {

        return {
            client: function() { return Constants.client; },
            stateName: function() {return $state.current.name;},
            title: function() {return this.client() + " " + this.stateName();}
        };
}])