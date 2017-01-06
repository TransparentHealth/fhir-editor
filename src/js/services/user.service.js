angular.module('fhir-editor').service('UserService', function() {
  var self = this;
  var sessionLoaded = false;
  var signedIn = false;
  // API Key and Client ID are defined in Google Developer Console, specific to developer account and each project (Ideally should be from DocDish account, not personal account)
  var apiKey = 'AIzaSyCX68Oqtu9WT5nJZAgoeasHJk91-3CmLCU';
  var clientId = '482782208078-sqeem22p4objiuvviagvf6tios32l42a.apps.googleusercontent.com';

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
