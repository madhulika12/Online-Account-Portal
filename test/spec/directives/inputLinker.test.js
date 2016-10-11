describe('Directive: inputLinker', function () {

  // load the controller's module
  var InputLinker, shared, Constants;

  beforeEach(inject(function ($rootScope, $document, $compile, _Constants_, _$timeout_) {
    shared = this;
    shared.document = $document
    shared.root = $rootScope;
    shared.scope = $rootScope.$new();
    Constants =  _Constants_;
    $timeout = _$timeout_;

    shared.matchedInputs =
      "<div input-linker='match' bad-link-text='BAD LINK'>" +
        "<input id='input1' class='input' type='text' ng-pattern='/^[\\s\\S]+$/' ng-model='input1val' name='input1'/>" +
        "<input id='input2' class='input' type='text' ng-pattern='/^[\\s\\S]+$/' ng-model='input2val' name='input2'/>" +
      "</div>"

    //recursively generates a string with 'num' number of inputs
    shared.getInputString = function (num, strng) {
      strng = strng || "<div input-linker='match' bad-link-text='BAD LINK'>"
      return (num > 0) ? shared.getInputString(--num, strng + "<input class='input' name='test' />") : strng + "</div>"
    }


    shared.buildForm = function (htmlStrng) {
      shared.testForm = "<form name='testForm' validation-highlights>" + htmlStrng + "</form>"
      shared.compiledForm = $compile(shared.testForm)(shared.scope)

      $document.find('body').append(shared.compiledForm)
    }


    shared.grabInputs = function () {
      return {
        input1 : $('#input1'),
        input2 : $('#input2')
      }
    }

  }));
  afterEach(function () {
    $('body').empty()
  })

  describe('tooManyInputs', function () {

    it('should throw an error if there are more or less than two inputs inside the div', function () {
      var threeInputs = shared.getInputString(3)
      var oneInput = shared.getInputString(1)

      expect(function () { shared.buildForm( threeInputs ) }).toThrow("inputLinker directive is only meant to wrap two form elements. It looks like you have implemented it on a container with 3.")
      expect(function () { shared.buildForm( oneInput ) }).toThrow("inputLinker directive is only meant to wrap two form elements. It looks like you have implemented it on a container with 1.")
    })
  })

  describe('match', function () {
    beforeEach(function () {
      shared.buildForm(shared.matchedInputs)
    })
    it ('should make the second input invalid if it does not match the first', function () {
      var inputs = shared.grabInputs()

      shared.scope.testForm.input1.$setViewValue("TEST1")
      shared.scope.testForm.input2.$setViewValue("TEST2")

      shared.root.$digest()

      expect(shared.scope.input1val).toEqual("TEST1")
      expect(shared.scope.testForm.input2.$invalid).toBe(true)


    })
    it ('should make the second input valid if it does match the first', function () {
      var inputs = shared.grabInputs()

      shared.scope.testForm.input1.$setViewValue("TEST1")
      shared.scope.testForm.input2.$setViewValue("TEST1")

      shared.root.$digest()

      expect(shared.scope.input1val).toEqual("TEST1")
      expect(shared.scope.input2val).toEqual("TEST1")
      expect(shared.scope.testForm.input2.$invalid).toBe(false)
    })
    it ('should place the bad link text onto the page if the inputs dont match', function () {
      var inputs = shared.grabInputs()

      shared.scope.testForm.input1.$setViewValue("TEST1")
      shared.scope.testForm.input2.$setViewValue("TEST2")

      shared.root.$digest()

      inputs.input1.triggerHandler('blur')
      $timeout.flush()

      var indicator = $('.input-specific-error-message').length

      expect(indicator).not.toEqual(0)
    })
    it ('should remove the bad link text from the page if the inputs do match', function () {
      var inputs = shared.grabInputs()

      //making the two inputs have different values
      //the indicator won't be added until a input event is fired
      shared.scope.testForm.input1.$setViewValue("TEST1")
      inputs.input1.triggerHandler('blur')

      inputs.input2.triggerHandler('blur')
      shared.root.$digest()

      //making sure the indicator got added first
      var indicator = $('.input-specific-error-message').length
      // console.log(indicator)
      expect(indicator).not.toEqual(0)

      //making the inputs match
      // inputs.input1.val("TEST1")
      // inputs.input1.triggerHandler('blur')
      shared.scope.testForm.input2.$setViewValue("TEST1")
      inputs.input2.triggerHandler('blur')

      shared.root.$digest()

      //testing that the indicator got removed
      indicator = $('.input-specific-error-message').length
      expect(indicator).toEqual(0)

    })
  })

})
