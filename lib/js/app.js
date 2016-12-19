(function() {
  "use strict";

  angular.module('fhir-editor', ['ui.router', 'LocalStorageModule'])
         .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
          // Future reference: locationProvider can allow for the use of html5
          // pushState mode, which removes the unnecessary hashtag from the url.
          // Needs some backend rerouting to work with page refreshes, though.
          // Using locationProvider also requires setting a <base> url in the
          // index.html <head> tag, or else setting requireBase: false.

          $urlRouterProvider.otherwise('/');

          $stateProvider.state('home', {
            url: '/',
            templateUrl: './src/views/home.html',
            controller: 'homeCtrl as home'
          }).state('home.base', {
            url: 'base',
            templateUrl: './src/views/base.html',
            controller: 'baseCtrl as base'
          }).state('home.affiliations', {
            url: 'affiliations',
            templateUrl: './src/views/affiliations.html',
            controller: 'affiliationsCtrl as affiliations'
          }).state('home.addresses', {
            url: 'addresses',
            templateUrl: './src/views/addresses.html',
            controller: 'addressesCtrl as addresses'
          }).state('home.specialties', {
            url: 'specialties',
            templateUrl: './src/views/specialties.html',
            controller: 'specialtiesCtrl as specialties'
          }).state('home.taxonomies', {
            url: 'taxonomies',
            templateUrl: './src/views/taxonomies.html',
            controller: 'taxonomiesCtrl as taxonomies',
          }).state('home.licenses', {
            url: 'licenses',
            templateUrl: './src/views/licenses.html',
            controller: 'licensesCtrl as licenses'
          }).state('home.notes', {
            url: 'notes',
            templateUrl: './src/views/notes.html',
            controller: 'notesCtrl as notes'
          }).state('home.submit', {
            url: 'submit',
            templateUrl: './src/views/submit.html',
            controller: 'submitCtrl as submit'
          });
        });
})();
;angular.module('fhir-editor').service('NPIService', function() {

  function getNPPESByNpi(npiId) {
    return $.ajax({
      method: 'GET',
      url: 'https://registry.npi.io/search/api/public/nppes/pjson/pjson.json',
      data: {
        number: npiId
      },
      success: function(response) {
        return response;
      },
      error: function(error) {
          return error;
      }
    });
  }

  function getPECOSByNpi(npiId) {
    return $.ajax({
      method: 'GET',
      url: 'https://registry.npi.io/search/api/public/pecos/compiled/compiled.json',
      data: {
        npi: npiId
      },
      success: function(response) {
        return response;
      },
      error: function(error) {
        return error;
      }
    });
  }

  return {
    getNPPESByNpi: getNPPESByNpi,
    getPECOSByNpi: getPECOSByNpi
  };
});
;angular.module('fhir-editor').service('UserService', function() {
  var self = this;
  var sessionLoaded = false;
  var signedIn = false;
  // API Key and Client ID are defined in Google Developer Console, specific to developer account and each project (Ideally should be from DocDish account, not personal account)
  var apiKey = 'AIzaSyAoA03P6BEAMdWPYxUBMAJ_zUE-tWOd4No';
  var clientId = '730683845367-dfn6jp8u8ii2u0f1iq8k1gc5noslkte9.apps.googleusercontent.com';

  var auth2;
  // When the api has loaded, run the init function.
  gapi.load('client:auth2', initAuth);

  // Get authorization from the user to access profile info
  function initAuth() {
      gapi.client.setApiKey(apiKey); // Define the apiKey for requests
      gapi.auth2.init({ // Define the clientId and the scopes for requests
          client_id: clientId,
          scope: 'profile'
      }).then(function() {
          auth2 = gapi.auth2.getAuthInstance(); // Store authInstance for easier accessibility
          auth2.isSignedIn.listen(updateSignInStatus);
          updateSignInStatus(auth2.isSignedIn.get());
      });
  }

  function updateSignInStatus(isSignedIn) {
      if (isSignedIn) {
        signedIn = true;
        sessionLoaded = true;
      } else {
        signedIn = false;
        sessionLoaded = true;
      }
  }

  // Sign the user in to their google account when the sign in button is clicked
  function signIn() {
      auth2.signIn({
          prompt: 'login'
      });
      return new Promise(function(resolve, reject) {
        var loopHandle = setInterval(function() {
          if (signedIn) {
            resolve(signedIn);
            clearInterval(loopHandle);
          }
        }, 20);
      });
  }

  // Sign the user out of their google account when the sign out button is clicked
  function signOut() {
      auth2.signOut();
      return new Promise(function(resolve, reject) {
        var loopHandle = setInterval(function() {
          if (!signedIn) {
            resolve(signedIn);
            clearInterval(loopHandle);
          }
        }, 20);
      });
  }

  // Use this to return the signIn status to the controller. Using Promise object
  // ensures that the controller will update with the latest status as soon as the
  // service finishes loading the authorized session.
  function checkSignIn() {
    return new Promise(function(resolve, reject) {
      var loopHandle = setInterval(function() {
        if (sessionLoaded) {
          resolve(signedIn);
          clearInterval(loopHandle);
        }
      }, 20);
    });
  }

  // This is only useful if needing to update the session token in an external database (possibly if we end up chaining the OAuths together?)
  // // Get the name of the user who signed in.
  // function getLogin() {
  //     var requestUser = gapi.client.request({
  //         path: 'https://people.googleapis.com/v1/people/me',
  //         method: 'GET'
  //     });
  //     requestUser.then(function(response) {
  //         user.picture = response.result.photos[0].url;
  //         user.uid = auth2.currentUser.Ab.El;
  //         user.token = auth2.currentUser.Ab.Zi.access_token;
  //         $.ajax({
  //             method: 'PATCH',
  //             url: 'https://forge-api.herokuapp.com/users/login',
  //             data: {
  //                 uid: user.uid,
  //                 token: user.token
  //             },
  //             success: function(response) {
  //                 user.joined = response.created_at;
  //                 user.username = response.username;
  //                 user.id = response.id;
  //                 loggedIn = true;
  //             },
  //             error: function(error) {
  //                 if (error.status === 404) {
  //                    // Display not found error
  //                 } else if (error.status === 0) {
  //                     // Do nothing
  //                 } else {
  //                     signOut();
  //                 }
  //             }
  //         });
  //     });
  // }

  return {
    signIn: signIn,
    signOut: signOut,
    checkSignIn: checkSignIn
  };
});
;angular.module('fhir-editor').controller('addressesCtrl', function($state, $scope) {
  
});
;angular.module('fhir-editor').controller('affiliationsCtrl', function($state, $scope) {

});
;angular.module('fhir-editor').controller('baseCtrl', function($state, $scope) {
  
});
;angular.module('fhir-editor').controller('homeCtrl', function($state, $scope, NPIService) {
  var self = this;
  this.resultFound = false;
  this.npiId = null;
  this.result = {
    title: null,
    npiId: null,
    gender: null,
    prefix: null,
    firstName: null,
    lastName: null,
    credential: null,
    status: null,
    soleProp: null,
    lastUpdated: null,
    addresses: null,
    taxonomies: null,
    licenses: null,
    pecosId: null,
    enrollmentId: null,
    enrollmentType: null,
    dateFirstApproved: null,
    dateLastApproved: null,
    numPatientsSeen: null,
    reassignments: null,
    specialties: null
  };

  this.runSearch = function() {
    if (self.npiId) {
      // Use the NPI to search NPPES to get the info available there
      NPIService.getNPPESByNpi(self.npiId).done(function(response) {
        if (response.code === 200) {
          if (response.results.length > 0) {
            console.log(response.results[0]);
            var responseInfo = response.results[0];
            self.result.title = responseInfo.title || 'N/A';
            self.result.npiId = responseInfo.number || 'N/A';
            self.result.gender = responseInfo.basic.gender || 'N/A';
            self.result.prefix = responseInfo.basic.name_prefix || 'N/A';
            self.result.firstName = responseInfo.basic.first_name || 'N/A';
            self.result.lastName = responseInfo.basic.last_name || 'N/A';
            self.result.credential = responseInfo.basic.credential || 'N/A';
            self.result.status = (responseInfo.basic.status === 'A') ? 'Active' : 'Not Active';
            self.result.soleProp = responseInfo.basic.sole_proprietor || 'N/A';
            self.result.lastUpdated = responseInfo.basic.last_updated || 'N/A';
            self.result.addresses = responseInfo.addresses || [];
            self.result.taxonomies = responseInfo.taxonomy_licenses || [];
            self.result.licenses = responseInfo.licenses || [];

            // Use the NPI to also search PECOS to get the info available there (Keep these requests nested so that the result page only loads if BOTH searches succeed)
            NPIService.getPECOSByNpi(self.npiId).done(function(response) {
              console.log(response);
              if (response.code === 200) {
                if (response.results.length > 0) {
                  var responseInfo = response.results[0];
                  self.result.pecosId = responseInfo.pecos_id || 'N/A';
                  self.result.enrollmentId = responseInfo.enrollment_id || 'N/A';
                  self.result.enrollmentType = responseInfo.enrollment_type || 'N/A';
                  self.result.dateFirstApproved = responseInfo.first_approved_date || 'N/A';
                  self.result.dateLastApproved = responseInfo.last_approved_date || 'N/A';
                  self.result.numPatientsSeen = responseInfo.number_patiens_seen || 'N/A';
                  self.result.reassignments = responseInfo.reassignments || [];
                  self.result.specialties = responseInfo.specialties || [];
                } else {
                  console.log("No PECOS search result");
                }
                self.resultFound = true;
                self.npiId = null;
                $state.go('home.base');
                $scope.$apply();
              } else {
                console.log("There was a problem during the PECOS search");
              }
            });
          } else {
            console.log("There were no results");
          }
        } else {
          console.log("There was a problem during the NPPES search");
        }
      });
    } else {
      console.log("Nothing to search!");
    }
  };

  window.onbeforeunload = function () {
    self.resultFound = false;
    $state.go('home');
  };
});
;angular.module('fhir-editor').controller('licensesCtrl', function($state, $scope) {

});
;angular.module('fhir-editor').controller('notesCtrl', function($state, $scope) {

});
;angular.module('fhir-editor').controller('specialtiesCtrl', function($state, $scope) {

});
;angular.module('fhir-editor').controller('submitCtrl', function(UserService, $state, $scope) {
  var self = this;
  this.signedIn = false;
  UserService.checkSignIn().then(function(signedIn) {
    self.signedIn = signedIn;
    $scope.$apply();
  });

  this.signIn = function() {
    UserService.signIn().then(function(signedIn) {
      self.signedIn = signedIn;
      $scope.$apply();
    });
  };

  this.signOut = function() {
    UserService.signOut().then(function(signedIn) {
      self.signedIn = signedIn;
      $scope.$apply();
    });
  };

  this.submitEdits = function() {
    console.log("Edits submitted!");
    $('.submitEditsBtn').css({
      'background': 'lightgreen',
      'color': 'white'
    }).text('Submitted!');
    setTimeout(function() {
      $('.submitEditsBtn').css({
        'background': 'buttonface',
        'color': 'buttontext'
      }).text('Submit Edits');
    }, 1000);
  };

});
;angular.module('fhir-editor').controller('taxonomiesCtrl', function($state, $scope) {

});
