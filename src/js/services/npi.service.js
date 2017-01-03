angular.module('fhir-editor').service('NPIService', function(PractitionerFHIR) {

    // GET from NPPES database
    function getNPPESByNpi(npiId) {
        return $.ajax({
            method: 'GET',
            url: 'http://docdish.com/djm/search/api/public/nppes/pjson/pjson.json',
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
            url: 'http://docdish.com/djm/search/api/public/pecos/compiled/compiled.json',
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

    //GET NPPES by name
    function getNPPESByName(firstName, lastName, state) {
      var data;
      if(state !== '') {
        data = {
        "basic.first_name": firstName,
        "basic.last_name": lastName,
         "addresses.state": state
       }
       } else  {
         data = {
         "basic.first_name": firstName,
         "basic.last_name": lastName
       }
       }
        return $.ajax({
            method: 'GET',
            url: 'http://docdish.com/djm/search/api/public/nppes/pjson/pjson.json',
                data: data,
            success: function(response) {
                return response;
            },
            error: function(error) {
                return error;
            }
        });
    }

    // Ideally should have a GET for FHIR as well
    /*
    GET FHIR
  */

    // POST to NPPES database
    function updateNPPES(updateInfo) {
        // Should use a NPPESUpdate Factory here to create the new update object from edited info (To keep the same format as original NPPES data)
        return $.ajax({
            method: 'PUT',
            url: 'http://docdish.com/djm/write/api/ip/nppes-update',
            data: JSON.stringify(updateInfo),
            success: function(response) {
                return response;
            },
            error: function(error) {
                return error;
            }
        });
    }

    // PUT to PECOS database
    function updatePECOS(updateInfo) {
        // Should use a PECOSUpdate Factory here to create the new update object from edited info (To keep the same format as original PECOS data)
        return $.ajax({
            method: 'PUT',
            url: 'http://docdish.com/djm/write/api/ip/pecos-update',
            data: JSON.stringify(updateInfo),
            success: function(response) {
                return response;
            },
            error: function(error) {
                return error;
            }
        });
    }

    // PUT to FHIR database for Practitioners (Providers)
    function updatePractitionerFHIR(info) {
        // Create a Practitioner FHIR object (FHIR compliant format) from edited info
        var newPractitioner = new PractitionerFHIR(info);
        console.log(newPractitioner);
        return $.ajax({
            method: 'PUT',
            url: 'http://docdish.com/djm/write/api/ip/update-Provider',
            data: JSON.stringify(newPractitioner),
            success: function(response) {
                return response;
            },
            error: function(error) {
                return error;
            }
        });
    }

    // Need PUTs for other FHIR types (Organization, etc)

    return {
        getNPPESByNpi: getNPPESByNpi,
        getPECOSByNpi: getPECOSByNpi,
        getNPPESByName: getNPPESByName,
        updateNPPES: updateNPPES,
        updatePECOS: updatePECOS,
        updatePractitionerFHIR: updatePractitionerFHIR
    };
});
