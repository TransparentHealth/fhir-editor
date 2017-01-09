var app =angular.module('fhir-editor');
app.controller('homeCtrl', function($state, $scope, $location, NPIService, UserService) {
    var self = this;
    /** Google Sign In Info **/
    this.signedIn = false;
    UserService.checkSignIn().then(function(signedIn) {
      self.signedIn = signedIn;
      $scope.$apply();
    });

    this.signIn = function() {
      UserService.signIn().then(function(signedIn, response) {
        self.signedIn = signedIn;
        console.log(response);
        $scope.$apply();
      });
    };

    this.signOut = function() {
      UserService.signOut().then(function(signedIn) {
        self.signedIn = signedIn;
        $scope.$apply();
      });
    };
    /** End of Google Sign In Info **/
    this.resultFound = false;
    this.summaryList = false;
    this.npi = null;
    this.firstName = null;
    this.lastName = null;
    this.orgName = null;
    this.submitButton = null;
    this.reminderPopup = null;
    this.state = '';
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
      this.preSearchClear();
      self.dataloading = true;
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
                  self.dataloading = false;
                  self.resultFound = true;
                  self.hideAbout = true;
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
      }
      else {
        console.log("Nothing to search!");
      }
      setTimeout(function() {
        self.dataloading = false;
        $scope.$apply();
        }, 4000);
    };

    this.nameSearch = function() {
      self.dataloading = true;
      this.resultFound = null;
      var FIRSTNAME = self.firstName ? self.firstName.toUpperCase() : null,
          LASTNAME = self.lastName ? self.lastName.toUpperCase() : null,
          state = self.state ? self.state : null;
        NPIService.getNPPESByName(FIRSTNAME, LASTNAME, state).done(function(response) {
            if (response.code === 200) {
                if (response.results.length > 0) {
                    self.dataloading = false;
                    self.summaryList = true;
                    self.hideAbout = true;
                    self.currentPage = 0;
                    console.log('NPPES Result:', response.results);
                    self.nameSearchResult = response.results;
                    self.pageNum = self.nameSearchResult.length;
                    $state.go('home.base');
                    $scope.$apply();
                    console.log()
                }
            } else {
                console.log("No NPPES name search result");
            }

        });
        setTimeout(function() {
          self.dataloading = false;
          $scope.$apply();
          }, 4000);
    };

    this.orgSearch = function() {
         var ORGNAME = self.orgName.toUpperCase();
         self.dataloading = true;
        self.dataloading = true;
        NPIService.getNPPESByOrg(ORGNAME).done(function(response) {
            if (response.code === 200) {
                if (response.results.length > 0) {
                    self.dataloading = false;
                    self.summaryList = true;
                    self.hideAbout = true;
                    self.currentPage = 0;
                    console.log('NPPES Result:', response.results);
                    self.nameSearchResult = response.results;
                    $state.go('home.base');
                    $scope.$apply();
                }
            } else {
                console.log("No NPPES name search result");
            }
        });
        setTimeout(function() {
          self.dataloading = false;
          $scope.$apply();
          }, 4000);
    };

//Pagination variables and function
    this.currentPage = 0;
    this.pageSize = 20;
    this.hideAbout = null;
    this.pageNum = null;
    this.numberOfPages= function(){
        return Math.ceil(self.pageNum/self.pageSize);
    };



    this.nameToNpi = function(thisNpi) {
      self.summaryList = false;
      self.npi = thisNpi;
      self.runSearch();
    };

  // for the searchfield submenu views and active class
  this.selected = {};
  this.selected = 'item1';
  this.select= function(item) {
        self.selected = item;
 };
 this.isActive = function(item) {
        return this.selected;
 };
   this.searchItems = [{
       id: 'item1',
       title: 'NPI'
   }, {
       id: 'item2',
       title: 'Name'
   }, {
       id: 'item3',
       title: 'Organization'
   }];

//Switches to red submit button when "save" is clicked
   this.submitActive = function() {
     self.editing = null;
     self.submitButton = true;
     this.reminder();
   };

//reminder popup shows, then goes
   this.reminder = function() {
     self.reminderPopup = true;
     setTimeout(function() {
         self.reminderPopup = null;
         $scope.$apply();
     }, 2000);
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
          $state.go('home');
      };

      this.preSearchClear = function() {
        this.result = {
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
        this.submitButton = null;
        this.nameSearchResult = null;
        this.nppesResult = null;
        this.pecosResult = null;
        this.fhirResult = null;
      };
  });

  app.filter('startFrom', function() {
      return function(input, start) {
          start = +start; //parse to int
          if (input) {
            return input.slice(start);
          }
      }
  });
