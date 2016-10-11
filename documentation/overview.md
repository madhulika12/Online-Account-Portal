# overview

**last update: 8/24/2016 by James Logan**

Hi! And welcome to the Kroll SSO web application documentation. Below you will find some overview information about the different functions that the app performs. For more detailed documentation of the individual services, configs, runs, directives, and controllers see their respective files in this directory.

* * *

## Authentication

Authentication is designed to be easily scaled and reused throughout the app.

Users are authenticated via tokens that are stored as query strings on the url. Calls to the API which authenticate the user (such as `httpService.activate`) will return a token which the app passes along to the next view as a $stateparam.

As was mentioned before, authentication is meant to be easy and pain free. Most of the mechanics of authentication have been modularized into the `tokenValidationService`. If a user needs to be authenticated to be on a certain view simply run this in the controller:

```
tokenValidationService.checkTokenAndRedirect()
```

This function will pull the token from the url, validate it with the API, and automatically redirect to the login screen if the token is invalid (or if the token doesn't exist at all).

If you don't want an automatic redirect you can run this instead:

```
tokenValidationService.checkToken()
```
This performs the same validation, just without the automatic redirect.

Both of these methods return a promise which is fulfilled when the validation request finishes. So, if you need to you can append `then`, `catch`, and `finally` blocks to them. See the `signUpCtrl` for an example of this.

For more detailed information, check the documentation for the `tokenValidationService` in `services.md`.

* * *

## Basic Form Validation

Form validation within the app looks complicated at first, but if you follow some fairly basic principles it should save you a lot of headache.

To get validation and provide users with feedback (e.g. with red highlights and input error boxes) your forms and inputs need to follow this pattern:

```
<form name="ctrlName.form" validation-highlights>
    <div>
        <input class="input" ng-model="ctrlName.whatever" ng-pattern="someRegex" name="someName" />
    </div>
    <div>
        <input class="input" ng-model="ctrlName.whatever2" ng-pattern="someRegex2" name="someName2" />
    </div>
</form>
```

The `form` element needs:
- a name attribute which follows the convention `ctrlName.form`. (this places the form on the controller, which may be useful in some cases)
- the `validation-highlights` directive.

Each `input`, `select`, and `textarea` needs:
- to be wrapped in its own `div`.
- the class `input`
- `ng-model`
- `ng-pattern` (**Pull these regexs from those stored in the Constants provider. Don't type one directly into the view.**)
- `name` attribute

Ideally, your controller would look like this:

```
.controller('ControllerLongName', function () {

  var self = this;

  self.data = {
    whatever : null,
    whatever2 : null,
    ...
  }

  self.regex = {
    someRegex : Constants.regexs.names
    someRegex2 : Constants.regexs.names
    ...
  }


  })
```

If you follow these rules. Then your form should validate and show the user red highlights and error messages on invalid inputs.

Additionally, you need to prevent form submission by disabling the submit button until the entire form is valid. Example:

```
<button type="submit" ng-click="ctrlName.sendForm()" ng-disabled="ctrlName.form.$invalid"></button>
```
^This is the primary reason you want to give the `form` a `name` attribute of `ctrlName.form`. Because it binds it to the controller automatically.

## Detailed Info On Form Validation

You don't need to read this to get validation to work. But it may help if you're having trouble.

Actual validation of inputs is done internally by Angular through `ng-pattern`. Which accepts a regex, and matches the input value against that regex.

However, displaying that information to the user via highlights and messages involves the interaction between the `validationHighlights` directive and the `inputErrorService`.

###### Highlights

The red highlights actually appear because Angular validation will add specific classes (`.ng-valid`, `.ng-invalid`, `.ng-touched`). You can see where we are adding styles to these classes in `main.scss`.  

###### Input Error Messages

On instantiation the `validationHightlights` directive searches the `form` for any children with the class `input`. Then it loops through them and places listeners on the `blur`, `change`, and `input` events for those children.

When a `blur`, `change`, or `input` event fires, the listener checks the `$valid` status for that input (which Angular has already marked true/false). If it's valid the directive will use the `inputErrorService` to remove any error messages. If it's invalid, the directive will use the `inputErrorService` to determine what error message is needed and then add it.

For more detailed info on the `validationHighlights` directive or the `inputErrorService` see the `directives.md` or the `services.md` respectively.

## Linked Inputs and Asynchronous Validation

There are a few instances in the application where two inputs need to match in order to be considered 'valid' (Example: in the 'sign-up' state, there is a 'PASSWORD' and a 'CONFIRM PASSWORD' input). This is accomplished via the `inputLinker` directive. See the `directives.md` file for information.

There are also a couple of inputs where validation is done asynchronously. (Example: In the 'sign-up' state. When the user is typing an email out, the form needs to query the backend to see if that email is available before they submit the form) This is accomplished via the `asyncValidate` directive. See the `directives.md` file for information.


* * *

## Controller Structure

Controllers in the app are meant to follow a predictable pattern so that nagivating them and replicating them in new views is easy.

In general, each controller has:

- `self.data` for storing form data.
- `self.regex` for exposing regexs pulled from the `Constants` provider to the view.
- `self.responseBoxConfig` for displaying messages/errors to the user.
- one or more request functions that run on form submission and send the form data to the API.
- two or more functions that handle responses to the API request.

Authenticated states will also run `tokenValidationService.checkTokenAndRedirect()` to check if the user is authenticated.

The basic structure should look like this:

```
.controller('ControllerLongName', [ 'httpService', 'tokenValidationService', function (httpService, tokenValidationService) {

  var self = this;

  self.data = {
    whatever : null,
    whatever2 : null,
    ...
  }

  self.regex = {
    someRegex : Constants.regexs.names
    someRegex2 : Constants.regexs.names
    ...
  }

  self.responseBoxConfig = {
    message : null,
    error : false,
    display : false
  }

  self.success = function (res) {
    // generally a redirect using a token/url stored in the response
  }

  self.error = function (err) {
    // this will usually populate the response box
  }

  self.requestExample = function () {
    httpService.exampleRequest(self.data)
      .then(self.success, self.error)
  }

  // only on authenticated states
  tokenValidationService.checkTokenAndRedirect()


})

```

* * *

## Styles

The app utilizes the Bootstrap CSS framework (especially the grid system), and Telerik's Kendo-UI for buttons and datepickers.

#### Client Specific Styles

In the long term, the SSO app is meant to service multiple clients. Thus, the user interface design (e.g. styles, title, logos, and favicon) of the app is architectured to be dynamic or "white-labeled".

The way this works internally is as follows:

1. The app checks the url on which it is being hosted.
2. The app sends this url to the API
3. The API returns data containing the file paths to the correct style resources.
4. The app requests these resources and uses them to render the user interface.

For more detailed info on this check out the `loadBrandingService` documentation in `services.md`.

For logos, favicons, and titles this process is fairly simple. However, for stylesheets it's a little more complex. During development our styles sheets are actually split into multiple partial documents. This allows styles to be created and stored in directories with the individual views/components that they are styling. Example:

```
app/appFiles/login
  /scripts
    loginCtrl.js
  /styles
    _login.scss
    _loginVariables.scss
  login.html
```
Here the styles for the login view are stored in a subdirectory with the code for the login view and login controller. This practice is called "folders by feature".

Our `grunt build` command will run a SCSS compiler which uses the code written in `app/styles/main.scss` to locate all necessary stylesheet partials located in these various "feature folders" and concatenate them into one css stylesheet.

The way we support *multiple clients* is by having multiple `main.scss` files. See below:

```
app/styles
  /IDShield
    main.scss
  /Kroll
    main.scss
  /Primerica
    main.scss
  main.scss

```

You'll notice that there is a `main.scss` that is not in a client folder. That scss file contains styles which are shared across all clients (which is the vast majority of styles).

Our feature folders then look like this:

```
app/appFiles/login
  /scripts
  /styles
    /IDShield
      _login.scss
    /Kroll
      _login.scss
    /Primerica
      _login.scss
    _login.scss
    _loginVariables.scss
  login.html
```

Each `main.scss` styles sheets will compile into its own individual css stylesheet. And, if you look inside of them, each is pulling in only stylesheets specific to its client (i.e. the `Primerica/main.scss` is only importing scss files that are either shared, or inside of a `Primerica` directory).

* * *
