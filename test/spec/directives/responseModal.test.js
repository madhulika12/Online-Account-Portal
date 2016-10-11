describe('Directive: responseModal', function () {

  // load the controller's module
  var shared, Constants, $state;

  beforeEach(inject(function ($rootScope, $document, $compile, _Constants_, _$state_) {
    $('body').empty()
    $state = _$state_;
    shared = this;
    shared.document = $document
    shared.root = $rootScope;
    shared.scope = $rootScope.$new();
    Constants =  _Constants_;

    spyOn($state, 'go')

    shared.buildModal = function () {
      shared.responseModal = "<response-modal title='TEST' message='test'></response-modal>"
      shared.compiledModal = $compile(shared.responseModal)(shared.scope)
      shared.scope.$digest()
      // console.log(shared.compiledModal)

      $document.find('body').append(shared.compiledModal)
      // console.log($document.find('body').find('#responseModal'))
    }

    shared.buildModal()

  }));
  afterEach(function () {
    $('body').empty()
  })

  describe('redirect', function () {
    it('should redirect to login', function () {

      $('#responseModal').modal('show');
      shared.compiledModal.isolateScope().redirectModal()
      // $('#responseModal').triggerHandler('hidden.bs.modal');
      $('#responseModal').on('shown.bs.modal', function () {
        shared.root.$digest()
        expect($state.go).toHaveBeenCalledWith('login')
      })
    })
    it('should remove the modal', function () {

      $('#responseModal').modal('show');
      $('#responseModal').on('shown.bs.modal', function () {
        shared.compiledModal.isolateScope().redirectModal()
        // $('#responseModal').triggerHandler('hidden.bs.modal');
        shared.root.$digest()
        expect( $('#responseModal').length ).toBe(0)
      })
    })
  })
});
