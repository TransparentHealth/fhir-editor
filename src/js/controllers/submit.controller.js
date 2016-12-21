angular.module('fhir-editor').controller('submitCtrl', function(UserService, NPIService, $state, $scope) {
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

  this.submitEdits = function(editedInfo) {
    var updateInfo = angular.copy(editedInfo);
    console.log("Edits submitted!", updateInfo);
    NPIService.updateNPPES(updateInfo).done(function(response) {
      console.log(response);
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
    });
    NPIService.updatePractitionerFHIR(updateInfo).done(function(response) {
      console.log(response);
    });
  };

});
