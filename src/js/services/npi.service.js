angular.module('fhir-editor').service('NPIService', function(PractitionerFHIR, APP_CONFIG) {

    //GET from NPPES database
    function getNPPESByNpi(npiId) {
        return $.ajax({
            method: 'GET',
            url: APP_CONFIG.nppesSearchUrl,
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
            url: APP_CONFIG.pecosSearchUrl,
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
        var data = {};
        data["basic.first_name"] = firstName ? firstName : undefined;
        data["basic.last_name"] = lastName ? lastName : undefined;
        data["addresses.state"] = state ? state : undefined;
        // console.log(data);
        return $.ajax({
            method: 'GET',
            url: APP_CONFIG.nppesSearchUrl,
            data: data,
            success: function(response) {
                return response;
            },
            error: function(error) {
                return error;
            }
        });
    }

    //GET organization by name
    function getNPPESByOrg(org) {
        return $.ajax({
            method: 'GET',
            url: APP_CONFIG.nppesSearchUrl,
            data: {
              title: org
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
    /*
    GET FHIR
  */

    // POST to NPPES database
    function updateNPPES(updateInfo) {
        // Should use a NPPESUpdate Factory here to create the new update object from edited info (To keep the same format as original NPPES data)
        return $.ajax({
            method: 'PUT',
            url: APP_CONFIG.nppesUpdateUrl,
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
            url: APP_CONFIG.pecosUpdateUrl,
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
            url: APP_CONFIG.fhirUpdatePractitionerUrl,
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
        getNPPESByOrg: getNPPESByOrg,
        updateNPPES: updateNPPES,
        updatePECOS: updatePECOS,
        updatePractitionerFHIR: updatePractitionerFHIR
    };
});
