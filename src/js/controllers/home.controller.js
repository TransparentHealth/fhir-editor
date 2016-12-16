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
      NPIService.getByNpi(self.npiId).done(function(response) {
          self.npiId = null;
          self.resultFound = true;
          self.result.title = response.title || 'N/A';
          self.result.npiId = response.number || 'N/A';
          self.result.gender = response.basic.gender || 'N/A';
          self.result.prefix = response.basic.name_prefix || 'N/A';
          self.result.firstName = response.basic.first_name || 'N/A';
          self.result.lastName = response.basic.last_name || 'N/A';
          self.result.credential = response.basic.credential || 'N/A';
          self.result.status = (response.basic.status === 'A') ? 'Active' : 'Not Active';
          self.result.soleProp = response.basic.sole_proprietor || 'N/A';
          self.result.lastUpdated = response.basic.last_updated || 'N/A';
          self.result.addresses = response.addresses || 'N/A';
          self.result.taxonomies = response.taxonomy_licenses || 'N/A';
          self.result.licenses = response.licenses || 'N/A';
          $state.go('home.base');
          $scope.$apply();
          console.log(response);
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
