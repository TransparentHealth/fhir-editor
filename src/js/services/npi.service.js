angular.module('fhir-editor').service('NPIService', function() {

  function getByNpi(npiId) {
    return $.ajax({
        method: 'GET',
        url: 'http://npi.npi.io/npi/' + npiId + '.json',
        success: function(response) {
            return response;
        },
        error: function(error) {
            return error;
        }
    });
  }

  return {
    getByNpi: getByNpi
  };
});
