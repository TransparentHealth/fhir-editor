angular.module('fhir-editor').controller('homeCtrl', function($state, $scope, NPIService) {
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
    licenses: null
  };

  this.runSearch = function() {
    if (self.npiId) {
      NPIService.getNPPESByNpi(self.npiId).done(function(response) {
        if (response.code === 200) {
          if (response.results.length > 0) {
            console.log(response.results[0]);
            var responseInfo = response.results[0];
            self.npiId = null;
            self.resultFound = true;
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
            self.result.addresses = responseInfo.addresses || 'N/A';
            self.result.taxonomies = responseInfo.taxonomy_licenses || 'N/A';
            self.result.licenses = responseInfo.licenses || 'N/A';
            $state.go('home.base');
            $scope.$apply();
          } else {
            console.log("There were no results");
          }
        } else {
          console.log("There was a problem during the search");
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
