angular.module('fhir-editor').service('NPIService', function(PractitionerFHIR) {

  // GET from NPPES database
  function getNPPESByNpi(npiId) {
    return $.ajax({
      method: 'GET',
      url: 'http://docdish.com/djmsearch/api/public/nppes/pjson/pjson.json',
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

  // GET from PECOS database
  function getPECOSByNpi(npiId) {
    return $.ajax({
      method: 'GET',
      url: 'http://docdish.com/djmsearch/api/public/pecos/compiled/compiled.json',
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

  // Ideally should have a GET for FHIR as well

  // POST to NPPES database
  function updateNPPES(updateInfo) {
    return $.ajax({
      method: 'POST', // Should be a PUT
      url: 'http://docdish.com/djmwrite/api/ip/update',
      data: JSON.stringify(updateInfo),
      success: function(response) {
        return response;
      },
      error: function(error) {
        return error;
      }
    });
  }

  // Need an update (PUT) for PECOS as well

  // PUT to FHIR database
  function updatePractitionerFHIR(info) {
    var newPractitioner = new PractitionerFHIR(info);
    console.log(newPractitioner);
    return $.ajax({
      method: 'PUT',
      url: 'http://52.72.172.54:8080/fhir/home',  // Needs to be updated to new fhir database
      data: JSON.stringify(newPractitioner),
      success: function(response) {
        return response;
      },
      error: function(error) {
        return error;
      }
    });
  }

  return {
    getNPPESByNpi: getNPPESByNpi,
    getPECOSByNpi: getPECOSByNpi,
    updateNPPES: updateNPPES,
    updatePractitionerFHIR: updatePractitionerFHIR
  };
});
