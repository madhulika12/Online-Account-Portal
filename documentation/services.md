# services

**last update: 8/22/2016 by James Logan**

* * *

## SERVICE: displayResponseBox

This is the service used to add and remove messages from the red/green response boxes. These messages should be used to report the status (either success or error) of requests made to the backend. These boxes look like this in view templates:

```
  <response-box config="ctrlAs.responseBoxConfig"></response-box>
```

The `response-box` directive is only used to inject a template. In order for the functionality to work the config attribute must be bound to an object with the following format:

```
ctrl.responseBoxConfig = {
  message : null,
  error : true,
  display : false
};
```

| Property name  | Description                                   |
| -------------  | ------------------------------                |
| `message`      | Controls the message that is displayed.       |
| `error`        | Controls the color of the box (red/green).    |
| `display`      | Controls whether or not the box is displayed. |

The displayResponseBox _service_ has two major functions:
1. Setting the content of the response box on the current view.
2. Storing content to be retrieved and displayed after redirecting to a new view.

#### Setting the Current View's Response Box

###### .populateResponseBox(boxConfig, message, errorStatus)

This will display the response box and set its content. Inside a controller, pass the configuration object along with the message you want to set and a boolean representing the error state.

| Parameter        | Description                                                                                                |
| -------------    | ------------------------------                                                                             |
| `boxConfig`      | `object` (one of the responseBoxConfig) This is the object whose properties this function is setting.      |
| `message`        | `string` The message you want to be displayed.                                                             |
| `errorStatus`    | `boolean` The color you want the box to be. True for red, false for green.                                 |

#### Storing a Response Box Configuration to Be Retrieved in another State/View

###### .setMessage(message, errorState)

Stores the configuration options for the response box.

| Parameter        | Description                                                                             |
| -------------    | ------------------------------                                                          |
| `message`        | `string` The message you want to be stored.                                             |
| `errorState`     | `boolean` The error state/color you want to be stored. True for red, false for green.   |


###### .checkMessage()

Retrieves the message stored in the service's private variable. (The only view currently using this is the login view which retrieves the "Password Confirmation" message after a redirect from the `having-trouble` view.)

NOTE This is a one time retrieval. Running `checkMessage` will return the message and then wipe it from the service's private variable. This is safety measure to prevent the message from accidentally appearing a second time.

`RETURN` A responseBoxConfig object.

#### Private Methods

###### .eraseStoredMessage()

Not meant to be used outside of the service. This wipes the stored message by replacing it with a deep copy of a blank responseBoxConfig.

* * *

## SERVICE: getUrl


This is a simple service which returns a function.

###### getUrl()

Returns a string based on the url environment of the app. During development on a `localhost` url, it will return the port number. In a production/stage environment it will return the base url (e.g. `idshieldstage.krollportal.com` ). These values are sent by other services to the webpage-attributes api to determine which client specific stylesheets are needed.

* * *

## SERVICE: httpService

The primary purpose of this service is to configure and execute calls to specific API endpoints on the backend.

##### .buildConfigure(method, endpoint, data, contentType)

This is a private method only meant to be used within the service. It's function is to create a configuration object which can be passed to `$http` to configure calls.

| Parameter     | Description                                           |
| ------------- | ------------------------------                        |
| `method`      | `string` The RESTful verb you want to use.            |
| `endpoint`    | `string` The url you want the request to hit.         |
| `data`        | `object` The data you want to pass with the request.  |
| `contentType` | `string` The url you want the request to hit.         |

All requests are passed with a `Content-Type` header of `application/x-www-form-urlencoded`. In addition, you'll notice that all requests are configured with a data property and a duplicate params property. From what I can tell, in `GET` requests using `$http`, the data property is ignored and the params property is used. In `POST` requests the params are ignored and the data is used. Adding both has not caused an issue with either POST or GET requests, but it is something to be aware of.

`RETURN` A configuration object to be passed to `$http`

Example Return:

```
{
  method : 'POST',
  url : 'https://mws.stage.kroll.com/api/v1/member/token/validate',
  data: [serialized query string of data],
  params : { Example : 'TEST_123' },
  headers : { 'Content-Type' : 'application/x-www-form-urlencoded'}
}

```

##### .request(config)

This method is designed to take one of the configuration objects generated by `buildConfigure` and make a RESTful call with it using `$http`. It wraps this call in `$q` promise and returns that promise.

If an http error comes back it will reject the promise and pass that error. If a positive http response comes back it will pass it to `checkResonse` for parsing. **This is very important because:** *Responses that come back with a positive http response code may still be errors.* `checkResponse` checks the response's `data.errorType` property and rejects anything that is not a `200`.

| Parameter     | Description                                                |
| ------------- | ------------------------------                             |
| `config`      | `object` Configuration object created by `buildConfigure`. |

`RETURN` A `$q` promise.

##### .checkResponse(def)

This a function building function. It takes a deferred promise and builds a function that will resolve/reject that deferred promise based on the response passed to it.

If the response does not have a `data` property or if the response does has a `data.errorType` other than `200`, it will reject the promise. Otherwise it will resolve the promise. In either a resolve or a reject it will pass along the response.

| Parameter     | Description                                           |
| ------------- | ------------------------------                        |
| `def`         | `object` Deferred object created by `request`.        |

`RETURN` A `function` that will evaluate positive http responses.

##### Other methods

Each of the following functions runs a nearly identical process:

1. Builds a configuration object. (using `buildConfigure`)
2. Makes a request with that configuration object. (using `request`)

They differ in the parameters they pass to buildConfigure (and thus in the configuration with which they're making a request):

|     Method          |  RESTful Verb  |             Endpoint                   |       Data                    |
|     ------          |  ------------  |             --------                   |       ----                    |
| `activate`          |     `POST`     |   Constants.endpoints.activate         |   Passed data.                |
| `login`             |     `POST`     |   Constants.endpoints.login            |   Passed data.                |
| `recoverAccount`    |     `POST`     |   Constants.endpoints.recoverAccount   |   Passed data.                |
| `validate`          |     `GET`      |   Constants.endpoints.getMemberByToken |   Passed data.                |
| `validateJWT`       |     `GET`      |   Constants.endpoints.validateJWT      |   Passed data.                |
| `signUp`            |     `POST`     |   Constants.endpoints.signUp           |   Passed data.                |
| `changePassword`    |     `POST`     |   Constants.endpoints.changePassword   |   Passed data.                |
| `setPassword`       |     `POST`     |   Constants.endpoints.setPassword      |   Passed data.                |
| `updateProfile`     |     `POST`     |   Constants.endpoints.updateProfile    |   Passed data.                |
| `updateEmail`       |     `POST`     |   Constants.endpoints.updateEmail      |   Passed data.                |
| `forgotPasword`     |     `POST`     |   Constants.endpoints.forgotPassword   |   Passed data.                |
| `acceptTerms`       |     `POST`     |   Constants.endpoints.acceptTerms      |   Passed data.                |
| `firstTimeActivate` |     `POST`     |   Constants.endpoints.forgotUsername   |   Passed data.                |
| `getMember`         |     `GET`      |   Constants.endpoints.getMemberByToken |   Passed data.                |
| `emailExist`        |     `GET`      |   Constants.endpoints.emailExist       |   { email: `passed string`}   |
| `usernameExist`     |     `GET`      |   Constants.endpoints.usernameExist    |   { email: `passed string`}   |

* * *

## SERVICE: inputErrorService

This service is meant to be used within the `validationHighlights` directive, and has not been tested outside of there (though you could technically use some of the functions in controllers). The primary function of this service is to add/remove error messaging from inputs. It checks which validation requirement has been violated on the input and appends the specific error message.

##### .invert()

This is a utility method which inverts an objects keys and values. Turning the values into keys and vice versa. There is a function in lodash which does this, but I felt it was a bad idea to import lodash for a single function.

##### .removeError(elem)

This function takes an element as a parameter and attempts to find and remove any elements that are siblings or children of siblings which are selected by the selector `.error-message.input-specific-error-message`.

##### .addMessage(element, message)

This function removes any error boxes that have already been added to the passed `element`, then adds an error box with the passed `message` parameter. This method can be used to add a custom message, but it is generally used as a final step in the next four methods: `addRequiredError`, `addValidationError`, `addAvailabilityError`, and `addMatchError`.

##### .addRequiredError(elem, model)

Runs addMessage with 'This field is required'. Will only ever run on inputs that are required.

##### .addValidationError(elem, model)

Runs addMessage with a message specific to the ng-pattern used to validate the input (e.g. If the input has the regex for username, this function will add the message stored in Constants.reasons.username, which is "Username must be between 6 and 64 characters. Spaces are not allowed.").

It does this by inverting the `Constants.regexs` object, then using the ng-pattern to search for the key of that particular regex. It then uses that key to pull the reason from the `Constants.reasons` object. Thus, a reason must always have a key which is exactly the same as the key for the regex that corresponds to that reason.

##### .addAvailabilityError(elem, model)

Grabs the `name` attribute of the input, then runs addMessage with a string built like this:

```
'That [name] is already taken.'
```

Currently only implemented on the signup page. Will only run on inputs that have the `asyncValidate` directive (see the directives docs).

##### .addMatchError(elem, model)

Runs addMessage with the string 'These two fields must match'. Will only run on inputs joined by the `inputLinker` directive (see the directives docs).

##### .determineError(elem, model)

| Parameter     | Description                                   |
| ------------- | ------------------------------                |
| `elem`        | `DOM Node` An input element.                  |
| `model`       | `Object` The `ng-model controller` for `elem` |

Determine error takes an element and an ng-model controller for that element. It checks the `$error` key on the model for all of the possible validation failures (matched, required, pattern, availability), and then runs one of the four functions detailed above based on which validation failed.

* * *

## SERVICE: loadBrandingService

This is a service created to request and store client specific file locations for stylesheets, favicons, logos, and title text. The SSO app is built to be white-labeled so that each clients can use their own styles/logos/colors/favicons without the technical team having to build a duplicate app.

##### On Instantiation

The service creates a deferred promise which is used by the calls made in the service.

##### .getBaseUrl

Runs the getUrl service function ( see getUrl service above ).

##### .getStyleSheetPromise()

Returns the promise used by the service so that it can be used by other services/controllers to place then/catch/finally blocks.

##### .getStyles()

Returns the styles object (which includes paths for styles/favicon/logo/title ) stored in the service. Initially these are all null. They are defined when the call made by getStyleSheetPath is returned.

##### .setDefault()

This sets the stored styles as the default styles (Kroll branding/logo/favicon/title) in the event that the request to the API fails, or comes back as an error.


##### .getStylesSheetPath()

Makes a call to the SSO API by passing along the current base url (or port number if running on localhost) as a query string.

On a successful response it will attempt to set the stored styles using `setStyles`. Then resolve the promise.

On an unsuccessful response it will set the styles to the default using `setDefault`. Then resolve the promise with the error response. (Note that this is unusual, it means that catch blocks will never fire on this promise. But in other spots in the app where that promise is being listened to we should not be doing anything different on a failed response, so there is no current need for catches)

`RETURN` A $q `promise`, so that then blocks can be appended.

##### .setStyles()

This is the function that is called by `getStylesSheetPath` on a positive http response. **This is very important because:** *Responses that come back with a positive http response code may still be errors.*

`setStyles` will set the default if the "positive" response data contains an error code, or if there is no response data.

Otherwise, on a completely successful response it will set the stored styles with the `data.responseObject`


* * *

## SERVICE: tokenValidationService

Authentication within the app is accomplished via tokens that are stored as query parameters (either `token` or `sptoken`) on the page url.

`token` used on most pages within the app. Just a GUIT provided by the API. These generally have an hour long lifespan though that is subject to change.

`sptoken` stands for Stormpath Token which is a Stormpath JWT token used to authenticate a user in Stormpath. These have a 24 hour lifespan and are only redeemable once. This is currently only used on the `reset-password` state.

NOTE: In order to enable token authentication on a state you need to add the `token` or `sptoken` to the state url in the config block. Example:

```
// sp token
.state('reset-password', {
    url: 'account/reset-password?sptoken',
    ...
})

// regular token
.state('sign-up', {
    url: 'account/sign-up?token',
    ...
})

//no token
.state('login', {
    url: 'login',
    ...
})
```

The purpose of this service is to pull tokens from the url query parameters and send them to the API for validation. On most views, if the token is invalid (either by having been redeemed already, or having expired - most tokens have a one hour time limit) the view will redirect to the login page.

##### .tokenInvalid(err)

This rejects the promise stored in the service (currently this only happens when a token is deemed invalid), passing along the error with the rejection.

##### .checkResponse(res)

This is the response parsing function that the `_requestTokenValidation` runs on a positive response. **This is very important because:** *Responses that come back with a positive http response code may still be errors.*

If the `response.data.errorType` is a `200` it will resolve the promise stored by the service. Otherwise it will reject the promise.

##### .requestTokenValidation()

Sends the current token through the `httpService.validate` call.

On a success it runs `checkResponse`.
On an error it rejects the promise with `tokenInvalid`.

##### .requestJWTValidation()

Does the same as `checkResponse` but it send the token through the `httpService.validateJWT`. Sends the current token through the httpService.validate call.

##### .getToken()

Grabs the `token` off of the current url.

##### .getJWT()

Grabs the `sptoken` off of the current url.

##### .checkToken()

Stores a new promise on the service, and attempts to grab the `token` off of the url.

If the token exists it runs `requestTokenValidation`. If it doesn't exist then it automatically rejects the promise with "Missing token" as an error message.

`RETURN` A $q `promise`.

##### .checkTokenAndRedirect()

Runs check token (see above), and attaches a `catch` block which redirects to the login on a rejection (if there is no token, or if the token is invalid). This is a convenience method, because redirecting is the most common step taken with an invalid token.

`RETURN` A $q `promise`.

##### .checkJWT()

Runs the exact same process as `checkToken` except that instead of checking the url for a `token` it checks for an `sptoken`, and instead of running `requestTokenValidation` it runs `requestJWTValidation`

`RETURN` A $q `promise`.

* * *
