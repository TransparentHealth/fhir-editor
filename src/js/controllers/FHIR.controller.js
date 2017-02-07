angular.module('fhir-editor').controller('fhirCtrl', function($state, $scope) {
var self = this;
this.newPractitioner = null;
this.htmlReady = null
this.fhirCreated = false;

this.homeFhir = function() {
  $scope.home.makeFhir();
this.newPractitioner = $scope.home.showFhir;
this.htmlReady = JSON.stringify(self.newPractitioner, null, 4);
this.fhirCreated = true;
};
});
