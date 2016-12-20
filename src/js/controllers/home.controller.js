angular.module('fhir-editor').controller('homeCtrl', function($state, $scope, NPIService) {
  var self = this;
  this.resultFound = false;
  this.npiId = null;
  this.result = {
    title: null,
    npiId: null,
    gender: null,
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
    reassignments: null,
    specialties: null
  };
  this.editing = null;

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
                  self.result.reassignments = responseInfo.reassignments || [];
                  // Set all reassignment Accepting New Patient statuses to "Yes"
                  self.result.reassignments.forEach(function(affiliation) {
                    affiliation.acceptingNew = "Yes";
                  });
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

  // Return user to the search screen when page is refreshed.
  window.onbeforeunload = function () {
    self.resultFound = false;
    $state.go('home');
  };
});
