# directives

* * *

##  DIRECTIVE: responseBox

All this directive does is pull in a template and expose the data stored in its `config` attribute to that template.

To work properly you need to create a configuration object on the controller (by convention and for the sake of sanity we have called this the `self.responseBoxConfig` in almost every controller). It should look like this:

```
self.responseBoxConfig = {
  message : null,
  error   : false,
  display : false
}
```
And in your view it should look like this:

```
<response-box config="ctrlName.responseBoxConfig"></response-box>
```

Manipulating these properties will affect what the response box template displays.

- The `error` property toggles the color. `true` makes it red, `false`
 makes it green.
- The `message` property holds the text that will be displayed in the box.
- The `display` property determines whether the box is displayed or hidden.

* * *

## DIRECTIVE: validationHighlights

On a high level, the purpose of this directive is to place listeners on each input so that when the value of the input changes it can decide whether to add or remove error messages. The basics of how to get this up and running on a new `form` are detailed in the `overview.md` under validation. This is a more in-depth view of the functions within the directive.

Break down of tasks the directive performs:
1. Searches the `form` on which it is placed and places a listener on each element with the class `input` **NOTE: Not input elements, elements with the class input**
2. When the listener fires it adds or removes error messaging based on the `$valid` status of that input's ng-model controller.

### Functions

##### link function

The link function searches the `form` for children with the class of `input`. This is important because we need it to work on `select` and `textarea` elements.

It then loops over the array of elements that is provided and runs `registerInputListener` on them (detailed below).

NOTE: There is an if statement that checks that the element being looped over is not a span. There is a detailed explanation for this within `validationHighlights.js`, but it suffices to say that it is a minor complication that comes from using the kendo-date picker for our date inputs.

##### registerInputListener(input, formCtrl)

This function takes and input element and the formCtrl for the `form` in which that element is located.

It then places one listener on the `change` and `input` events. And a second listener on the `blur` event.

We'll expound on the `blur` listener first because it's simpler. The blur listener is an anonymous function which:
1. Creates and angular.element (which is really just a jQuery element) from the input.
2. Uses the formCtrl to find the ng-model controller for that input. (Note, ng-model controllers for each input are stored on the formCtrl with the key that equals the `name` attribute of that input.)
3. Runs `checkValidation` on the input and it's ng-model controller.

In short, `checkValidation` is what checks if the input is valid or not and applies the right messaging. It is explained in detail below.

**So, in effect, on every `blur` the validation state of an input is checked, and the correct messaging is applied or removed.**

For `change` and `input` events it does the exact same thing, *except* it employs a debounce. This is a subtle but very important UX feature. The debounce prevents `checkValidation` from running unless 500 milliseconds have passed since the last event.

In effect, this prevents an annoying error message from popping up the instant you type something. It will wait until you slow down or finish typing.  

##### checkValidation(element, model)

This function takes and angular.element and an ng-model controller. The ng-model controller for an input is where the validation status of an input is stored by Angular's internal validators.

`checkValidation` first checks to see if the input value is invalid. If it is then it runs `inputErrorService.determineError`, which checks why the input value is invalid and appends the correct error message to the DOM. For more detailed information on that looking in the `services.md` documentation.

If the input value is not invalid, the function then checks to see if the input value is valid. If it is then it runs `inputErrorService.removeError` which removes any error messaging that had previously been appended to that input element.

* * *

##  DIRECTIVE: inputLinker

This directive consists of a link function with several internal functions. We'll go over broadly what the link function does, then delve into the specific internal functions.

#### Overview

Here's how you inject this directive into the view:

```
<div input-linker>
  <input class="input"... />
  <input class="input"...  />
</div>
```

Simple right? The only requirement is that **there must be 2 inputs inside the div**. If there are more or less the directive will actually throw a console error. Each input must also have the `input` class.

The first thing the link function does is define some variables. It grabs the two child inputs and assigns them to their own variable. Then it grabs the ng-model controller for each input and assigns it to its own variable.

Then it defines several functions, and checks that there are exactly 2 inputs inside the div.

At the end of the link function it sets a new validation function on the second input (by running `setMatchValidator`). Then it forces events in the first input to validate the second input, fire a `input` event on the second (by running `pairValidation`).

##### match() and setMatchValidator()

Ng-model controllers in Angular have a property called `$validators` which contains an object that holds all of the functions used to validate an input. It looks something like this:

```
$validators : {
    pattern : function () { ... } // checks the input value against a regex
  }
```  

The pattern key is created when you use the `ng-pattern` directive on an input. You can add more validation by adding functions to this object. This is exactly what we do.

We use `setMatchValidator` to add the `match` function as an additional validator under the key `matched`. So now our `$validators` looks like this:
```
$validators : {
    pattern : function () { ... } ,
    matched : function (modelValue, viewValue) {
      return (viewValue === firstModel.$viewValue) ? true : false;
    }
  }
```  

You'll notice that `firstModel` is defined in the link function. The `match` function will continue to know about `firstModel` because it has been captured in a Javascript closure.

Each validator function is passed the current model value for the input, and the current view value. The view value is what we're actually validating, since angular will not allow an invalid view value to be copied into the model. What the `match` function does is it checks if the `viewValue` parameter (i.e. the view value of the second input) is equal to the view value of the first input. If it is it returns `true`, else it returns `false`. Angular uses the returned `boolean` to decide whether an input is valid or not.

##### pairValidation()

Normally in angular, the validity of an input is only checked the view value of that input changes (i.e. every time a character is added or removed from the input box).  This is a problem for us because we need the second input to check its validity in two cases:

1. The normal case, when someone types in the second input box.
2. The unusual case, when someone types in the first input box.

`pairValidation` is how we accomplish this. It adds an event listener to the `blur`, `input`, and `change` events of the first input box. The listener then runs the `$validate` function of the second input's ng-model controller. `$validate` does exactly what it says: it runs all of the functions stored in `$validators` (*including* the `matched` validator we previously added). So, now every time a change occurs in the first input, Angular will check if the second input is still valid.

The second thing the listener does is fire an `input` event on the second input. This is necessary because the `validation-highlights` directive only adds/removes error messaging to an input when an event is fired on that particular input.


* * *

## DIRECTIVE: asyncValidate

This directive is exactly what it sounds like: it uses an asynchronous call to the backend to determine whether an input value is valid or invalid. Currently, we only use this for entering new emails and usernames.

Here's what this looks like in the view:

```
<input
  ng-model="signUp.data.Username"
  async-validate="usernameExist"
  ...
  />
```

The directive takes a value which currently has two possibilities: `usernameExist` and `emailExist`. These values are just the names of methods stored on the `httpService`:

```
emailExist : function (emailString) {
  var con = this._buildConfigure('GET', Constants.endpoints.emailExist, { email : emailString})
  return this.request(con)
},

usernameExist : function (usernameString) {
  var con = this._buildConfigure('GET', Constants.endpoints.usernameExist, { userid : usernameString})
  return this.request(con)
}
```

The `asyncValidate` directive takes one of these requests, creates a new function that wraps the request in a $q `promise`, and attaches that new function to the `$asyncValidators` object on the ng-model controller of the input. That is explained in more detail below:

In addition to the `$validators` object that every ng-model controller has, there is also an `$asyncValidators` object. Where as the `$validators` functions return a `boolean`, the functions stored in `$asyncValidators` return a `promise`. The fulfillment of that promise (resolve/reject) determines whether Angular deems the input value valid or invalid.

In essence, if we get an error response back from that request we reject the promise and the value is marked invalid. If we get a success response back, we resolved the promise and the value is marked valid.

Additionally, we add a `finally` block to that `promise` which triggers a `blur` event on the input. This triggers the `validation-highlights` directive to either add or remove an error message. You'll notice that the `blur` event is triggered inside a `$timeout`. `$timeout`s that are not passed an actual delay time will defer until the next digest cycle to run their callback. This ensures that angular has time to validate before the `blur` event is fired.

* * *
