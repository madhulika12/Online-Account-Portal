'use strict';

describe('Controller: ValidationCtrl', function () {

  var ValidationCtrl, shared;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $document, $state, $compile) {
    shared = this;
    shared.scope = $rootScope.$new();
    shared.state = $state
    shared.rootScope= $rootScope

    function buildInputElement () {
      shared.element = angular.element('<input class="input test"/>');
      shared.inputContainer = angular.element('<div class="container has-success"></div>');

      shared.inputContainer.append(shared.element);

      shared.compiledElement = $compile(shared.inputContainer)(shared.scope);

      angular.element($document[0].body).append(shared.compiledElement);

    }

    buildInputElement();

    shared.instanitateController = function () {
      ValidationCtrl = $controller('validationCtrl', {
        $scope: shared.scope
        // place here mocked dependencies
      });
    }

    shared.instanitateController()
  }));

  describe('on instantiation', function () {
    it('should set a regex to the re key on itself', function () {
      expect(ValidationCtrl.re).toBeDefined()
      expect(ValidationCtrl.re instanceof RegExp).toBe(true)
    });
  });
  describe('setRegularExpression', function () {
    beforeEach(function () {
      shared.emailUpdate = true
      spyOn(shared.state, 'is').and.callFake(function () {
        return shared.emailUpdate
      })
    })
    it('if the state is update-email, should set an email validating regex to the re key on the controller', function () {
      ValidationCtrl.setRegularExpression()
      expect(ValidationCtrl.re).toEqual(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)
    });
    it('if the state is not update email, should set an alphanumberic validating regex to the re key on the controller', function () {
      shared.emailUpdate = false
      ValidationCtrl.setRegularExpression()
      expect(ValidationCtrl.re).toEqual(/^[a-zA-Z0-9]+$/)
    })

  })

  describe('testInputValidity', function (){
    beforeEach(function () {
      shared.emailUpdate = true
      spyOn(shared.state, 'is').and.callFake(function () {
        return shared.emailUpdate
      })
    })

    it('should remove the has-success class when the input value does not pass the regex test', function () {
      ValidationCtrl.setRegularExpression()
      shared.element.val("TEST_INVALID_EMAIL")
      ValidationCtrl.testInputValidity()
      // shared.inputContainer.addClass("dogss")
      var testElement = angular.element( ValidationCtrl.username[0]).closest('div')
      expect(testElement.hasClass("has-success")).toBe(false)
      expect(testElement.hasClass("has-error")).toBe(true)

    })

    it('should add the has-success class when the input value does pass the regex test', function () {
      ValidationCtrl.setRegularExpression()
      angular.element( ValidationCtrl.username[0] ).val("test@valid.com")
      ValidationCtrl.testInputValidity()
      var testElement = angular.element( ValidationCtrl.username[0] ).closest('div')
      expect(testElement.hasClass("has-success")).toBe(true)
      expect(testElement.hasClass("has-error")).toBe(false)

    })


  })


})
