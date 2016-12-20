angular.module('fhir-editor').controller('affiliationsCtrl', function(NPIService, $state, $scope) {
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
