'use strict';

describe('Constant: Constants', function () {

  var Constants, testEvent, testElement, testFlag;

  beforeEach(inject(function (_Constants_) {
    Constants = _Constants_;

    var testElement = angular.element("<input />")
    testFlag = false;

    testElement.on('input', function () {
      testFlag = true;
    })

    testEvent = {
      sender : {
        element : [testElement]
      }
    }

  }));
  describe('datePicker.change', function () {
    it('should trigger an input on the sender element', function () {
      expect(testFlag).toBe(false)
      Constants.datePickerOptions.change(testEvent)
      expect(testFlag).toBe(true)

    })
  })
});
