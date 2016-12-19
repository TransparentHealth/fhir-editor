angular.module('fhir-editor').service('NPIService', function() {

  function getNPPESByNpi(npiId) {
    return $.ajax({
      method: 'GET',
      url: 'https://registry.npi.io/search/api/public/nppes/pjson/pjson.json',
      data: {
        number: npiId
      },
      success: function(response) {
        return response;
      },
      error: function(error) {
          return error;
      }
    });
  }

  function getPECOSByNpi(npiId) {
    return $.ajax({
      method: 'GET',
      url: 'https://registry.npi.io/search/api/public/pecos/compiled/compiled.json',
      data: {
        npi: npiId
      },
      success: function(response) {
        return response;
      },
      error: function(error) {
        return error;
      }
    });
  }

  return {
    getNPPESByNpi: getNPPESByNpi
  };
});
