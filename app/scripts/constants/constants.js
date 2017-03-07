"use strict";

angular.module('ssoApp')
.constant('Constants', {
  //endpoints

  loginSourceId : 2,
//   portalBaseUrl : 'https://login.mysecuredashboard.com/idp/startSSO.ping?PartnerSpId=sso:imc:90000013&REF=',
  portalBaseUrl : 'https://loginstage.mysecuredashboard.com/idp/startSSO.ping?PartnerSpId=sso:imc:90000013&REF=',
  tokenCookieKey : 'ssoSessionId',
  fifteenMinutes : 900000,
  refreshTime : 900,
  // twoMinutes: 60000,
  client: null,

  defaultStyles : {
    stylesheet : "styles/Kroll/main.css",
    favicon : "images/Kroll/kroll_favicon.ico",
    title : "Kroll Identity Theft Protection",
    logo : "images/Kroll/logo.png"
  },
  // defaultStyles : {
  //   stylesheet : "styles/IDShield/main.css",
  //   favicon : "images/IDShield/favicon.ico",
  //   title : "IDShield Identity Theft Protection",
  //   logo : "images/IDShield/IDShieldLogo.png"
  // },
//   endpoints : {
//     validateJWT : 'https://mws.stage.kroll.com/api/v1/member/token/validate',
//     activate : 'https://mws.stage.kroll.com/api/v1/member/activate',
//     firstTimeActivate : 'https://mws.stage.kroll.com/api/v1/member/account-activation',
//     updateEmail : 'https://mws.stage.kroll.com/api/v1/member/email-update',
//     signUp : 'https://mws.stage.kroll.com/api/v1/member/sign-up',
//     setPassword : 'https://mws.stage.kroll.com/api/v1/member/set-password',
//     changePassword : 'https://mws.stage.kroll.com/api/v1/member/change-password',
//     recoverAccount : 'https://mws.stage.kroll.com/api/v1/member/recover-account',
//     // login : 'https://localhost:44300/api/v1/member/login',
//     login : 'https://mws.stage.kroll.com/api/v1/member/login',
//     acceptTerms : 'https://mws.stage.kroll.com/api/v1/member/account/terms-and-conditions',
//     forgotPassword : 'https://mws.stage.kroll.com/api/v1/member/forgot-password',
//     content: 'https://mws.stage.kroll.com/api/v1/client/content',
//     forgotUsername : 'https://mws.stage.kroll.com/api/v1/member/forgot-userid',
//     multiClient: 'https://mws.stage.kroll.com/api/v1/client/content',
//     // getMemberByToken: 'https://localhost:44300/api/v1/member/sign-up/load',
//     getMemberByToken: 'https://mws.stage.kroll.com/api/v1/member/sign-up/load',
//     validateAccountActivation: 'https://mws.stage.kroll.com/api/v1/member/session/validate',
//     emailExist : 'https://mws.stage.kroll.com/api/v1/member/email-userid/exist',
//     usernameExist : 'https://mws.stage.kroll.com/api/v1/member/email-userid/exist',
//     updateProfile : 'https://mws.stage.kroll.com/api/v1/member/personal/update',
//     antiForgeryToken : 'https://mws.stage.kroll.com/api/v1/security/tokens',
//     delCookie: 'https://mws.stage.kroll.com/api/v1/member/token/redeem',
//     extendTimeout: 'https://mws.stage.kroll.com/api/v1/member/extend-session'
//   },

// endpoints : {
//     validateJWT : 'https://mws.stage.kroll.com/api/v1/member/token/validate',
//     activate : 'https://mws.stage.kroll.com/api/v1/member/activate',
//     firstTimeActivate : 'https://mws.stage.kroll.com/api/v1/member/account-activation',
//     updateEmail : 'https://mws.stage.kroll.com/api/v1/member/email-update',
//     signUp : 'https://mws.stage.kroll.com/api/v1/member/sign-up',
//     setPassword : 'https://mws.stage.kroll.com/api/v1/member/set-password',
//     changePassword : 'https://mws.stage.kroll.com/api/v1/member/change-password',
//     recoverAccount : 'https://mws.stage.kroll.com/api/v1/member/recover-account',
//     // login : 'https://localhost:44300/api/v1/member/login',
//     login : 'https://mws.stage.kroll.com/api/v1/member/login',
//     acceptTerms : 'https://mws.stage.kroll.com/api/v1/member/account/terms-and-conditions',
//     forgotPassword : 'https://mws.stage.kroll.com/api/v1/member/forgot-password',
//     content: 'https://mws.stage.kroll.com/api/v1/client/content',
//     forgotUsername : 'https://mws.stage.kroll.com/api/v1/member/forgot-userid',
//     multiClient: 'https://mws.stage.kroll.com/api/v1/client/content',
//     // getMemberByToken: 'https://localhost:44300/api/v1/member/sign-up/load',
//     getMemberByToken: 'https://mws.stage.kroll.com/api/v1/member/sign-up/load',
//     validateAccountActivation: 'https://mws.stage.kroll.com/api/v1/member/session/validate',
//     emailExist : 'https://mws.stage.kroll.com/api/v1/member/email-userid/exist',
//     usernameExist : 'https://mws.stage.kroll.com/api/v1/member/email-userid/exist',
//     updateProfile : 'https://mws.stage.kroll.com/api/v1/member/personal/update',
//     antiForgeryToken : 'https://mws.stage.kroll.com/api/v1/security/tokens',
//     delCookie: 'https://mws.stage.kroll.com/api/v1/member/token/redeem',
//     extendTimeout: 'https://mws.stage.kroll.com/api/v1/member/extend-session'
//   },

endpoints : {
    baseUrl: 'https://auth-api.stage.kroll.com/api/v1/',

    // baseUrl: 'https://mws.stage.kroll.com/api/v1/',

    validateJWT : function() {
                return this.baseUrl + 'member/token/validate';
                },

    activate : function() {
                return this.baseUrl + 'member/activate';
                },

    firstTimeActivate : function() {
                return this.baseUrl + 'member/account-activation';
                },

    updateEmail : function() {
                return this.baseUrl + 'member/email-update';
                },

    signUp : function() {
                return this.baseUrl + 'member/sign-up';
                },

    setPassword : function() {
                return this.baseUrl + 'member/set-password';
                },

    changePassword : function() {
                return this.baseUrl + 'member/change-password';
                },

    recoverAccount : function() {
                return this.baseUrl + 'member/recover-account';
                },

    login : function() {
                return this.baseUrl + 'member/login';
                },

    acceptTerms : function() {
                return this.baseUrl + 'member/account/terms-and-conditions';
                },

    forgotPassword : function() {
                return this.baseUrl + 'member/forgot-password';
                },

    content : function() {
                return this.baseUrl + 'client/content';
                },

    multiClient : function() {
                return this.baseUrl + 'client/content';
                },

    getMemberByToken : function() {
                return this.baseUrl + 'member/sign-up/load';
                },

    validateAccountActivation : function() {
                return this.baseUrl + 'member/session/validate';
                },

    emailExist : function() {
                return this.baseUrl + 'member/email-userid/exist';
                },

    usernameExist : function() {
                return this.baseUrl + 'member/email-userid/exist';
                },

    updateProfile : function() {
                return this.baseUrl + 'member/personal/update';
                },

    antiForgeryToken : function() {
                return this.baseUrl + 'security/tokens';
                },

    delCookie : function() {
                return this.baseUrl + 'member/token/redeem';
                },
            
    extendTimeout : function() {
                return this.baseUrl + 'member/extend-session';
                },
  },

  regexs : {
    email : /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i,
    username: /^\S{6,64}$/, //matches a string of 6 to 64 characters that is only letters and numbers
    numbersOnly : /^\d+$/, //matches any number of digits
    lettersOnly : /^[a-zA-Z]+$/,
    names: /^[a-zA-Z'\-,.\s]{2,50}$/,
    city: /^[a-zA-Z'-,.\s]{2,70}$/,//TODO allowing stars???
    phone: /^\d{10}$/,
    zip : /^\d{5}([ \-]\d{4})?$/, //matches 5 digits followed by an optional dash and 4 digits
    date: /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2]\d|3[0,1])\/(19|20)\d{2}$/,
    //rough date regex, MM-dd-YYYY, does NOT account for leap years, does NOT limit days according to what month it is. Limits months 01 - 12, limits dates 01 - 31, limits years 1900 - 2099.
    anything: /^[\s\S]+$/,
    address: /^[a-zA-z0-9\s-'.]{2,99}$/, //matches any alphanumeric, periods, spaces, dashes, apostrophes
    ssn: /^\d{9}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/,
  },

  titleRegexs : {
      IDShield: /(IDShield)+g/,
      Primerica: /(Primerica)+g/
  },

  reasons : {
    email : "This is not a valid email.",
    username: "Username must be between 6 and 64 characters. Spaces are not allowed.",
    numbersOnly : "Only numbers are allowed.",
    lettersOnly : "Only letters are allowed.",
    names: "Only letters, spaces, periods, dash, and apostrophes are allowed. This field cannot exceed 50 characters.",
    zip : "Zip code must contain 5 numbers or 9 numbers with a dash.",
    phone : "Phone number must contain 10 numbers including the area code.",
    date: "Date must be formatted MM/DD/YYYY.",
    anything: "This field is required.",
    address: "Only numbers, letters, spaces, dash, apostrophes, and periods are allowed. This field cannot exceed 100 characters.",
    ssn: "SSN must be 9 numbers. Dashes or spaces are not allowed.",
    password: "Passwords must be between 8 and 15 characters. They must container at least one lower case letter, one uppercase letter, and one number.",
    city : "Cities must be two characters or more and can only contain letters, apostrophes, commas, dashes, periods, or spaces."
  },

  datePickerOptions : {
    depth: "date",
    start: "century",
    max: (new Date()),
    footer: false,
    readOnly: true,
    change: function (event, something) {
      //this is firing a fake an input event, because selecting a date with the kendo datepicker does not fire the input event.
      angular.element(event.sender.element[0]).triggerHandler('input');
    }
  },

  generations : [
    { val: '', tag: 'none'},
    { val:'jr', tag: 'Jr' },
    { val:'sr', tag: 'Sr' },
    { val:'i', tag: 'I' },
    { val:'ii', tag: 'II' },
    { val:'iii', tag: 'III' },
    { val:'iv', tag: 'IV' },
    { val:'v', tag: 'V' }
  ],

  states : [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "abbreviation": "FM"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Guam",
        "abbreviation": "GU"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Palau",
        "abbreviation": "PW"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
  ]

});
