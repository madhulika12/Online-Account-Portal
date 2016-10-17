angular.module('ssoApp')
.service('inputErrorService', ['Constants', function (Constants) {
  return {
    _invert : function (obj) {
      var newObj = {}
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[obj[key]] = key
        }
      }
      return newObj
    },

    removeError : function (elem) {
      $(elem).parent().find(".error-message.input-specific-error-message").remove()
    },

    addMessage : function (element, message) {
      // console.log('inputErrorService.addMessage')
      this.removeError(element)
      var node = '<div class="error-message input-specific-error-message"><span>' + message + '</span><div style="clear: both;"></div></div>'

      if ($(element).parent().find(".error-message").length === 0) {
        $(element).parent().append(node)
      }
    },

    addRequiredError : function (elem, model) {
      this.addMessage(elem, 'This field is required.')
    },

    addValidationError : function (elem, model) {
      var pattern = elem[0].attributes.getNamedItem('ng-pattern')
      if (pattern) {
        var regex =  pattern.value;
        var message = Constants.reasons[this._invert(Constants.regexs)[regex]]
      }
      this.addMessage(elem, message)
    },

    addValidationErrorNumbers : function (elem, model) {
      var pattern = elem[0].attributes.getNamedItem('ng-pattern')
      var message = Constants.reasons.numbersOnly
      this.addMessage(elem, message)
    },

    addAvailabilityError : function (elem, model) {
        this.addMessage(elem, 'That ' + elem[0].attributes.getNamedItem('name').value + ' is already taken')
    },

    addMatchError : function (elem, model) {
      this.addMessage(elem, "These two fields must match.")
    },

    determineErrorNew : function (elem, model) {
      // console.log('inputErrorService.determineError', model)
      this.checkError(elem, model)
      this.addAvailabilityError(elem)       
    },

  determineErrorOld : function(elem, model) {
      if (model.$error.matched) {
        this.addMatchError(elem)
      } else if (model.$error.required) {
        this.addRequiredError(elem)
      } else if (model.$error.pattern) {
            this.addValidationError(elem)
        } else {
            this.addAvailabilityError(elem)
          }   
  },  

    determineError : function(elem, model) {
      if (model.$error.matched) {
        this.addMatchError(elem)
      } else if (model.$error.required) {
        this.addRequiredError(elem)
      } else if (model.$error.pattern) {
            this.patternError(elem, model)
        } else {
            this.addAvailabilityError(elem)
          }   
  }, 

  checkError : function (elem, model) {
      // console.log('inputErrorService.determineError', model)
      if (model.$error.matched) {
        this.addMatchError(elem)
      } else if (model.$error.required) {
        this.addRequiredError(elem)
      } else if (model.$error.pattern) {
        //this.patternError(elem, model)
      } else {
        this.addAvailabilityError(elem)
      }
    },

  patternError: function(elem, model) {

    if(elem[0].id == "ZipCode" || elem[0].id == "Phone") {
          console.log(elem[0].id);
          if(model.$viewValue.match(Constants.regexs.lettersOnly || Constants.regexs.zip)) {
            this.addValidationErrorNumbers(elem)
          } else {
            this.addValidationError(elem)
          }
    } else {
            this.addValidationError(elem)
             //this.addAvailabilityError(elem)
    }

    console.log(model);

  }
  }
}])