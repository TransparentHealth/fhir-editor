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
;angular.module('fhir-editor').factory('PractitionerFHIR', function() {
  function PractitionerFHIR(info) {
    var self = this;
    this.id = info.id;
    this.resourceType = "Practitioner";
    this.identifier = [
      {
        "system": "http://hl7.org/fhir/sid/us-npi",
        "value": info.number
      }
    ];
    this.active = (info.basic.status === 'A');
    this.name = [
      {
        "family": info.basic.last_name,
        "given": [
          info.basic.first_name
        ]
        // "prefix": [
        //   "Dr"
        // ]
      }
    ];
    this.gender = null;
    if (info.basic.gender === 'M') {
      self.gender = 'male';
    } else if (info.basic.gender === 'F') {
      self.gender = 'female';
    } else {
      self.gender = 'unknown';
    }
    if (info.addresses) {
      this.address = [];
      info.addresses.forEach(function(address) {
        var currentAddress = {
          use: address.address_purpose,
          line: [
            address.address_1,
            address.address_2
          ],
          city: address.city,
          state: address.state,
          postalCode: address.zip
        };
        self.address.push(currentAddress);
      });
    }
    if (info.reassignments) {
      this.role = [];
      info.reassignments.forEach(function(affiliation) {
        var role = {
          "identifier": [
            {
              "system": "http://hl7.org/fhir/sid/us-npi",
              "value": affiliation.reassigned_to.npi
            }
          ]
        };
        if (affiliation.endpoints) {
          role.endpoint = [];
          affiliation.endpoints.forEach(function(endpoint) {
            var newEndpoint = {};
            if (endpoint.type === 'Direct Email') {
              newEndpoint.name = 'Direct Email';
              newEndpoint.contact = {
                system: 'email',
                value: endpoint.value
              };
            } else if (endpoint.type === 'Regular Email') {
              newEndpoint.name = 'Regular Email';
              newEndpoint.contact = {
                system: 'email',
                value: endpoint.value
              };
            } else if (endpoint.type === 'Web') {
              newEndpoint.name = 'Web';
              newEndpoint.contact = {
                system: 'url',
                value: endpoint.value
              };
            }
            role.endpoint.push(newEndpoint);
          });
        }
        self.role.push(role);
      });
    }
  };

  return PractitionerFHIR;
});
;angular.module('fhir-editor').service('NPIService', function(PractitionerFHIR) {

    // GET from NPPES database
    function getNPPESByNpi(npiId) {
        return $.ajax({
            method: 'GET',
            url: 'http://docdish.com/djm/search/api/public/nppes/pjson/pjson.json',
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

    // GET from PECOS database
    function getPECOSByNpi(npiId) {
        return $.ajax({
            method: 'GET',
            url: 'http://docdish.com/djm/search/api/public/pecos/compiled/compiled.json',
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

    //GET NPPES by name
    function getNPPESByName(firstName, lastName) {
        return $.ajax({
            method: 'GET',
            url: 'http://docdish.com/djm/search/api/public/nppes/pjson/pjson.json',
            data: {

                "basic.first_name": firstName,
                "basic.last_name": lastName

            },
            success: function(response) {
                return response;
            },
            error: function(error) {
                return error;
            }
        });
    }

    // Ideally should have a GET for FHIR as well
    /*
    GET FHIR
  */

    // POST to NPPES database
    function updateNPPES(updateInfo) {
        // Should use a NPPESUpdate Factory here to create the new update object from edited info (To keep the same format as original NPPES data)
        return $.ajax({
            method: 'PUT',
            url: 'http://docdish.com/djm/write/api/ip/nppes-update',
            data: JSON.stringify(updateInfo),
            success: function(response) {
                return response;
            },
            error: function(error) {
                return error;
            }
        });
    }

    // PUT to PECOS database
    function updatePECOS(updateInfo) {
        // Should use a PECOSUpdate Factory here to create the new update object from edited info (To keep the same format as original PECOS data)
        return $.ajax({
            method: 'PUT',
            url: 'http://docdish.com/djm/write/api/ip/pecos-update',
            data: JSON.stringify(updateInfo),
            success: function(response) {
                return response;
            },
            error: function(error) {
                return error;
            }
        });
    }

    // PUT to FHIR database for Practitioners (Providers)
    function updatePractitionerFHIR(info) {
        // Create a Practitioner FHIR object (FHIR compliant format) from edited info
        var newPractitioner = new PractitionerFHIR(info);
        console.log(newPractitioner);
        return $.ajax({
            method: 'PUT',
            url: 'http://docdish.com/djm/write/api/ip/update-Provider',
            data: JSON.stringify(newPractitioner),
            success: function(response) {
                return response;
            },
            error: function(error) {
                return error;
            }
        });
    }

    // Need PUTs for other FHIR types (Organization, etc)

    return {
        getNPPESByNpi: getNPPESByNpi,
        getPECOSByNpi: getPECOSByNpi,
        getNPPESByName: getNPPESByName,
        updateNPPES: updateNPPES,
        updatePECOS: updatePECOS,
        updatePractitionerFHIR: updatePractitionerFHIR
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
;angular.module('fhir-editor').controller('affiliationsCtrl', function(NPIService, $state, $scope) {
  var self = this;

  this.endpointTypes = [
    'Direct Email',
    'Regular Email',
    'Web'
  ];

  this.affiliationTypes = [
    'Medicare'
  ];

  this.addEndpoint = function(affiliation) {
    if (!affiliation.endpoints) {
      affiliation.endpoints = [];
    }
    console.log(affiliation.newEndpoint);
    affiliation.endpoints.push(angular.copy(affiliation.newEndpoint));
  };

  this.searchNewNpi = function() {
    
  };
});
;angular.module('fhir-editor').controller('baseCtrl', function($state, $scope) {
  
});
;angular.module('fhir-editor').controller('homeCtrl', function($state, $scope, $location, NPIService, UserService) {
    var self = this;
    this.resultFound = false;
    this.summaryList = false;
    this.npi = null;
    this.firstName = null;
    this.lastName = null;
    this.dataloading = false;
    this.result = { // This really is a buffer variable to keep track of edits - should be named more appropriately. Info from here is used in the updates.
      id: null,
      title: null,
      number: null,
      basic: null,
      identifiers: null,
      addresses: null,
      taxonomies: null,
      taxonomy_licenses: null,
      licenses: null,
      pecos_id: null,
      enrollment_id: null,
      enrollment_type: null,
      reassignments: null,
      specialties: null,
      type: null
    };
    this.editing = null;
    this.nameSearchResult = null; // Original NPPES result for names
    this.nppesResult = null;  // Original NPPES result before edits
    this.pecosResult = null;  // Original PECOS result before edits
    this.fhirResult = null;   // Original FHIR result before edits

    this.runSearch = function() {
      if (self.npi) {
        // Use the NPI to search NPPES to get the info available there
        NPIService.getNPPESByNpi(self.npi).done(function(response) {
          if (response.code === 200) {
            if (response.results.length > 0) {
              // NOTE: Need to account for Organizations' as well as Individual Practitioner's NPI results
              console.log('NPPES Result:', response.results[0]);
              self.nppesResult = angular.copy(response.results[0]);
              var responseInfo = response.results[0];
              if (responseInfo.enumeration_type === 'NPI-2') {  // If search result is an organization
                self.result.type = 'Organization';
                self.result.addresses = responseInfo.addresses || [];
                self.result.basic = responseInfo.basic || [];
                self.result.id = responseInfo.id || null;
                self.result.number = responseInfo.number || 'N/A';
                self.result.taxonomies = responseInfo.taxonomies || [];
                self.result.taxonomy_groups = responseInfo.taxonomy_groups || [];
                self.result.title = responseInfo.title || 'N/A';
              } else if (responseInfo.enumeration_type === 'NPI-1') { // If search result is individual
                self.result.type = 'Individual';
                self.result.id = responseInfo.id || null;
                self.result.title = responseInfo.title || 'N/A';
                self.result.number = responseInfo.number || 'N/A';
                self.result.basic = responseInfo.basic || [];
                self.result.identifiers = responseInfo.identifiers || [];
                self.result.addresses = responseInfo.addresses || [];
                self.result.taxonomies = responseInfo.taxonomies || [];
                self.result.taxonomy_licenses = responseInfo.taxonomy_licenses || [];
                self.result.licenses = responseInfo.licenses || [];
              }
              // Use the NPI to also search PECOS to get the info available there (Keep these requests nested so that the result page only loads if BOTH searches succeed)
              NPIService.getPECOSByNpi(self.npi).done(function(response) {
                if (response.code === 200) {
                  if (response.results.length > 0) {
                      console.log('PECOS Result:', response.results[0]);
                      self.pecosResult = angular.copy(response.results[0]);
                      var responseInfo = response.results[0];
                      self.result.pecos_id = responseInfo.pecos_id || 'N/A';
                      self.result.enrollment_id = responseInfo.enrollment_id || 'N/A';
                      self.result.enrollment_type = responseInfo.enrollment_type || 'N/A';
                      self.result.reassignments = responseInfo.reassignments || [];
                      // Set all reassignment Accepting New Patient statuses to "Yes" if it does not already exist
                      self.result.reassignments.forEach(function(affiliation) {
                          if (!affiliation.acceptingNew) {
                              affiliation.acceptingNew = "Yes";
                          }
                      });
                      self.result.specialties = responseInfo.specialties || [];
                      // Should have a GET for FHIR by NPI here as well, for reference.
                  } else {
                      console.log("No PECOS search result");
                  }
                  self.resultFound = true;
                  self.npi = null;
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

    this.nameSearch = function() {
        var FIRSTNAME = self.firstName.toUpperCase();
        var LASTNAME = self.lastName.toUpperCase();
        self.dataloading = true;
        NPIService.getNPPESByName(FIRSTNAME, LASTNAME).done(function(response) {
            if (response.code === 200) {
                if (response.results.length > 0) {
                    self.dataloading = false;
                    self.summaryList = true;
                    console.log('NPPES Result:', response.results);
                    self.nameSearchResult = response.results;
                    $scope.$apply();
                }
            } else {
                console.log("No NPPES name search result");
                self.dataloading = false;
            }
        });
    };

    //Mobile nav show/hide
    this.mobileNav = function() {
        var id = document.getElementById('navId');
        if (id.className === "leftNav") {
            id.className += " navShow";
        } else {
            id.className = "leftNav";
        }
    },
    // Return user to the search screen when page is refreshed. (Prevents problems with trying to repopulate views with empty info)
    window.onbeforeunload = function() {
        this.resultFound = false;
        this.summaryList = false;
        this.npi = null;
        this.firstName = null;
        this.lastname = null;
        this.result = { // This really is a buffer variable to keep track of edits - should be named more appropriately. Info from here is used in the updates.
            id: null,
            title: null,
            number: null,
            basic: null,
            identifiers: null,
            addresses: null,
            taxonomies: null,
            taxonomy_licenses: null,
            licenses: null,
            pecos_id: null,
            enrollment_id: null,
            enrollment_type: null,
            reassignments: null,
            specialties: null
        };
        this.editing = null;
        this.nameSearchResult = null; //Original NPPES result
        this.nppesResult = null; // Original NPPES result before edits
        this.pecosResult = null; // Original PECOS result before edits
        this.fhirResult = null; // Original FHIR result before edits
        $state.go('home');
    };
});
;angular.module('fhir-editor').controller('licensesCtrl', function($state, $scope) {

});
;angular.module('fhir-editor').controller('notesCtrl', function($state, $scope) {

});
;angular.module('fhir-editor').controller('specialtiesCtrl', function($state, $scope) {

});
;angular.module('fhir-editor').controller('submitCtrl', function(UserService, NPIService, $state, $scope) {
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
    var editedInfo = $scope.home.result;
    var updateInfo = angular.copy(editedInfo);

    var originalNPPESInfo = $scope.home.nppesResult;
    var originalPECOSInfo = $scope.home.pecosResult;
    // Testing "trivial updates" with no differences first
    var testNPPESUpdateInfo = angular.copy(originalNPPESInfo);
    var testPECOSUpdateInfo = angular.copy(originalPECOSInfo);

    console.log("Test NPPES Update Info:", testNPPESUpdateInfo);
    console.log("Test PECOS Update Info:", testNPPESUpdateInfo);
    console.log("Test FHIR Update Info:", updateInfo);

    NPIService.updateNPPES(testNPPESUpdateInfo).done(function(response) {
      console.log("NPPES Update Response", response);
    });
    NPIService.updatePECOS(testPECOSUpdateInfo).done(function(response) {
      console.log("PECOS Update Response", response);
    });
    NPIService.updatePractitionerFHIR(updateInfo).done(function(response) {
      console.log("FHIR Update Response", response);
    });

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
