angular.module('fhir-editor').controller('submitCtrl', function(UserService, $state, $scope) {
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
