angular.module('fhir-editor').factory('PractitionerFHIR', function() {
  function PractitionerFHIR(info) {
    var self = this;
    this.id = info.id;
    this.resourceType = "Practitioner";
    this.identifier = [
      {
        "system": "http://hl7.org/fhir/sid/us-npi",
        "value": info.number
      }
    ];
    this.active = (info.basic.status === 'A');
    this.name = [
      {
        "family": info.basic.last_name,
        "given": [
          info.basic.first_name
        ]
        // "prefix": [
        //   "Dr"
        // ]
      }
    ];
    this.gender = null;
    if (info.basic.gender === 'M') {
      self.gender = 'male';
    } else if (info.basic.gender === 'F') {
      self.gender = 'female';
    } else {
      self.gender = 'unknown';
    }
    this.address = [];
    info.addresses.forEach(function(address) {
      var currentAddress = {
        use: address.address_purpose,
        line: [
          address.address_1,
          address.address_2
        ],
        city: address.city,
        state: address.state,
        postalCode: address.zip
      };
      self.address.push(currentAddress);
    });
    this.role = [];
    info.reassignments.forEach(function(affiliation) {
      var role = {
        "identifier": [
          {
            "system": "http://hl7.org/fhir/sid/us-npi",
            "value": affiliation.reassigned_to.npi
          }
        ]
      };
      if (affiliation.endpoints) {
        role.endpoint = [];
        affiliation.endpoints.forEach(function(endpoint) {
          var newEndpoint = {};
          if (endpoint.type === 'Direct Email') {
            newEndpoint.name = 'Direct Email';
            newEndpoint.contact = {
              system: 'email',
              value: endpoint.value
            };
          } else if (endpoint.type === 'Regular Email') {
            newEndpoint.name = 'Regular Email';
            newEndpoint.contact = {
              system: 'email',
              value: endpoint.value
            };
          } else if (endpoint.type === 'Web') {
            newEndpoint.name = 'Web';
            newEndpoint.contact = {
              system: 'url',
              value: endpoint.value
            };
          }
          role.endpoint.push(newEndpoint);
        });
      }
      self.role.push(role);
    });
  };

  return PractitionerFHIR;
});
