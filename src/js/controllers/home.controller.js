angular.module('fhir-editor').controller('homeCtrl', function($state, $scope, $location, NPIService, UserService) {
    var self = this;
    this.resultFound = false;
    this.summaryList = false;
    this.npi = null;
    this.firstName = null;
    this.lastname = null;
    this.dataloading = false;
    this.result = { // This really is a buffer variable to keep track of edits - should be named more appropriately. Info from here is used in the updates.
        id: null,
        title: null,
        number: null,
        basic: null,
        identifiers: null,
        addresses: null,
        taxonomies: null,
        taxonomy_licenses: null,
        licenses: null,
        pecos_id: null,
        enrollment_id: null,
        enrollment_type: null,
        reassignments: null,
        specialties: null
    };
    this.editing = null;
    this.nameSearchResult = null; //Original NPPES result
    this.nppesResult = null; // Original NPPES result before edits
    this.pecosResult = null; // Original PECOS result before edits
    this.fhirResult = null; // Original FHIR result before edits

    this.runSearch = function() {
        if (self.npi) {
            // Use the NPI to search NPPES to get the info available there
            NPIService.getNPPESByNpi(self.npi).done(function(response) {
                if (response.code === 200) {
                    if (response.results.length > 0) {
                        // NOTE: Need to account for Organizations' as well as Individual Practitioner's NPI results
                        console.log('NPPES Result:', response.results[0]);
                        self.nppesResult = angular.copy(response.results[0]);
                        var responseInfo = response.results[0];
                        self.result.id = responseInfo.id || null;
                        self.result.title = responseInfo.title || 'N/A';
                        self.result.number = responseInfo.number || 'N/A';
                        self.result.basic = responseInfo.basic || [];
                        self.result.identifiers = responseInfo.identifiers || [];
                        self.result.addresses = responseInfo.addresses || [];
                        self.result.taxonomies = responseInfo.taxonomies || [];
                        self.result.taxonomy_licenses = responseInfo.taxonomy_licenses || [];
                        self.result.licenses = responseInfo.licenses || [];

                        // Use the NPI to also search PECOS to get the info available there (Keep these requests nested so that the result page only loads if BOTH searches succeed)
                        NPIService.getPECOSByNpi(self.npi).done(function(response) {
                            if (response.code === 200) {
                                if (response.results.length > 0) {
                                    console.log('PECOS Result:', response.results[0]);
                                    self.pecosResult = angular.copy(response.results[0]);
                                    var responseInfo = response.results[0];
                                    self.result.pecos_id = responseInfo.pecos_id || 'N/A';
                                    self.result.enrollment_id = responseInfo.enrollment_id || 'N/A';
                                    self.result.enrollment_type = responseInfo.enrollment_type || 'N/A';
                                    self.result.reassignments = responseInfo.reassignments || [];
                                    // Set all reassignment Accepting New Patient statuses to "Yes" if it does not already exist
                                    self.result.reassignments.forEach(function(affiliation) {
                                        if (!affiliation.acceptingNew) {
                                            affiliation.acceptingNew = "Yes";
                                        }
                                    });
                                    self.result.specialties = responseInfo.specialties || [];
                                    // Should have a GET for FHIR by NPI here as well, for reference.
                                } else {
                                    console.log("No PECOS search result");
                                }
                                self.resultFound = true;
                                self.npi = null;
                                $state.go('home.base');
                                $scope.$apply();
                            } else {
                                console.log("There was a problem during the PECOS search");
                            }
                        });
                    } else {
                        console.log("There were no results");
                    }
                } else {
                    console.log("There was a problem during the NPPES search");
                }
            });
        } else {
            console.log("Nothing to search!");
        }
    };

    this.nameSearch = function() {
        var FIRSTNAME = self.firstName.toUpperCase();
        var LASTNAME = self.lastName.toUpperCase();
        self.dataloading = true;
        NPIService.getNPPESByName(FIRSTNAME, LASTNAME).done(function(response) {
            if (response.code === 200) {
                if (response.results.length > 0) {
                    self.dataloading = false;
                    self.summaryList = true;
                    console.log('NPPES Result:', response.results);
                    self.nameSearchResult = response.results;
                    $scope.$apply();
                }
            } else {
                console.log("No NPPES name search result");
                self.dataloading = false;
            }
        });
    };

    //Mobile nav show/hide
    this.mobileNav = function() {
        var id = document.getElementById('navId');
        if (id.className === "leftNav") {
            id.className += " navShow";
        } else {
            id.className = "leftNav";
        }
    },
    // Return user to the search screen when page is refreshed. (Prevents problems with trying to repopulate views with empty info)
    window.onbeforeunload = function() {
        this.resultFound = false;
        this.summaryList = false;
        this.npi = null;
        this.firstName = null;
        this.lastname = null;
        this.result = { // This really is a buffer variable to keep track of edits - should be named more appropriately. Info from here is used in the updates.
            id: null,
            title: null,
            number: null,
            basic: null,
            identifiers: null,
            addresses: null,
            taxonomies: null,
            taxonomy_licenses: null,
            licenses: null,
            pecos_id: null,
            enrollment_id: null,
            enrollment_type: null,
            reassignments: null,
            specialties: null
        };
        this.editing = null;
        this.nameSearchResult = null; //Original NPPES result
        this.nppesResult = null; // Original NPPES result before edits
        this.pecosResult = null; // Original PECOS result before edits
        this.fhirResult = null; // Original FHIR result before edits
        $state.go('home');
    };
});
