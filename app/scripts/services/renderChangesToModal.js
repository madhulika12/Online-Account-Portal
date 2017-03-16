angular.module('ssoApp')
    .service('renderChangesToModal', function() {
        var self = this;

        self.setView = function(modelCtrl, data) {
            if(modelCtrl.$name == "Generation") {
                console.log("Converting to lowercase");
                var lowerCaseData = data.toLowerCase();
                console.log(data);
                modelCtrl.$setViewValue(lowerCaseData)
            } else {
                modelCtrl.$setViewValue(data);
            }

            modelCtrl.$render()
            modelCtrl.$validate()
        }
    });