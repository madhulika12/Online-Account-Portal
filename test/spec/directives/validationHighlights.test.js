
describe('Directive: validationHighlights', function () {

  var ValidationHighlights, shared, formBuilder, Constants;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $document, $compile, _Constants_) {

    // $('body').empty()

    shared = this;
    shared.document = $document
    shared.rootScope = $rootScope;
    shared.scope = $rootScope.$new();
    Constants =  _Constants_;

    var formFactory = function (scope) {
      var Scope = scope;
      Scope.model = scope.model || {}
      Scope.regex = scope.regex || null
      return {
        start: "<form name='formHandler' validation-highlights>",
        end: "</form>",
        text: "<div><input class='input' type='text' ng-pattern='regex' ng-model='model.text' name='text_dummy'></div>",
        number: "<div><input class='input' type='number' ng-pattern='regex' ng-model='model.number' name='number'></div>",
        buildText: function () {
          return angular.element(this.start + this.text + this.end)
        },
        buildNumber: function () {
          return angular.element(this.start + this.number + this.end)
        },
        compileText: function () {
          var element = $compile(this.buildText())(Scope)
          $document.find('body').append(element)
        },
        compileNumber: function () {
          var element = $compile(this.buildNumber())(Scope)
          $document.find('body').append(element)
        },
        deleteForm: function () {
          $('body').empty()
        }
      }
    }

    formBuilder = formFactory(shared.scope)

  }));

  describe('redHighlight', function () {
    beforeEach(function () {
      formBuilder.compileText();
      shared.scope.regex = Constants.regexs.email;
      shared.div = shared.document.find("div")
    })
    afterEach(function () {
      //needed or the tests will fail
      formBuilder.deleteForm()
    })

    it('should validate', function () {
      shared.scope.formHandler.text_dummy.$setViewValue('cat@dog.com')
      shared.rootScope.$digest()
      expect(shared.scope.model.text).toEqual("cat@dog.com");
      expect(shared.scope.formHandler.text_dummy.$valid).toBe(true)
    })

    // it('should place the .has-error class on invalid form elements', function () {
    //
    //   expect(shared.div.hasClass('has-error')).toEqual(false);
    //
    //   //change the value and fire a fake input
    //   shared.scope.formHandler.text_dummy.$setViewValue('catdog.com')
    //   shared.document.find('.input').triggerHandler('blur');
    //
    //
    //   //check ipnut model, check if the class is present
    //   expect(shared.scope.model.text).toEqual(undefined);
    //   expect(shared.div.hasClass('has-error')).toEqual(true);
    // })
    // it('should remove the .has-success class from invalid form elements', function () {
    //   //starting conditions, putting the success class on the div surrounding the element
    //   shared.div.addClass('has-success');
    //   expect(shared.div.hasClass('has-success')).toEqual(true);
    //
    //   //change the value and fire a fake input event
    //   shared.scope.formHandler.text_dummy.$setViewValue('catdog.com')
    //   shared.document.find('.input').triggerHandler('blur');
    //
    //   //check ipnut model, check if the class is absent
    //   expect(shared.scope.model.text).toEqual(undefined);
    //   expect(shared.div.hasClass('has-success')).toEqual(false);
    //
    // })
  })

  describe('greenHighlight', function () {
    beforeEach(function () {
      formBuilder.compileText();
      shared.scope.regex = Constants.regexs.email;
      shared.div = shared.document.find("div")
      // console.log("\n\ntext_dummy\n\n", shared.scope.formHandler.text_dummy)
    })
    afterEach(function () {
      //needed or the tests will fail
      formBuilder.deleteForm()
    })
    // it('should place the .has-success class on valid form elements', function () {
    //   expect(shared.div.hasClass('has-success')).toEqual(false);
    //
    //   //change the value to a valid value and fire a fake input
    //   shared.scope.formHandler.text_dummy.$setViewValue('cat@dog.com')
    //   shared.document.find('.input').triggerHandler('blur');
    //
    //   //check ipnut model, check if the class is present
    //   expect(shared.scope.model.text).toEqual('cat@dog.com');
    //   expect(shared.div.hasClass('has-success')).toEqual(true);
    //
    // })
    // it('should remove the .has-error class from invalid form elements', function () {
    //   //starting conditions, putting the error class on the div surrounding the element
    //   shared.div.addClass('has-error');
    //   expect(shared.div.hasClass('has-error')).toEqual(true);
    //
    //   //change to a valid value and fire a fake input event
    //   shared.scope.formHandler.text_dummy.$setViewValue('cat@dog.com')
    //   shared.document.find('.input').triggerHandler('blur');
    //
    //   //check ipnut model, check if the class is absent
    //   expect(shared.scope.model.text).toEqual('cat@dog.com');
    //   expect(shared.div.hasClass('has-error')).toEqual(false);
    //
    //
    // })
  })

})
