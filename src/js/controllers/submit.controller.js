angular.module('fhir-editor').controller('submitCtrl', function(UserService, NPIService, $state, $scope) {
  var self = this;

  this.submitEdits = function() {
    var editedInfo = $scope.home.result;
    var updateInfo = angular.copy(editedInfo);
    $scope.home.submitButton = null;

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
