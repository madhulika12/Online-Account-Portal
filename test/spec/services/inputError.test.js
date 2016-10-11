'use strict';

describe('Service: inputError', function () {

  var inputErrorService;

  beforeEach(inject(function (_inputErrorService_) {
    inputErrorService = _inputErrorService_;
  }));
  describe('_invert', function () {
    it('it should invert an objects keys and values', function () {
      var start = { a : "b", c : "d", e : "f" }
      var end = { b : "a", d : "c", f : "e" }
      expect( inputErrorService._invert(start) ).toEqual(end)
    })
  })

});
