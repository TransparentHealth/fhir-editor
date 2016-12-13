FHIR Document Editor for Provider Directories
=============================================


The application shall be an HTML5/JavaScript application that allows
local manipulation of Providers (in FHIR format). The FHIR resource type
(e.g. Practitioner, Organization, other) can be validated locally and then sent
to the RESTFul FHIR server to update the database (MongoDB).

The application will manage an HTML form (or forms) that will allow for the easy manipulation
of provider data including:

* Affiliations - Dr. Who provides Medicare via Johns Hopkins and Mercy Hospital in Baltimore
* Addresses - Practice, Billing, Facility
* Licenses - From NPPES and first party sources
* Taxonomies - Taxonomy code and description (nucc.org but we have CSV tables
* Specialties -  Specialty code and description (we have CSVs)


Other Requirements

* The application shall support the FHIR standard for document encoding and RESTFul API communication. See  http://build.fhir.org/index.html
* To edit data the application user must be authenticated (Our OAuth2 cms.oauth2.io and Google OAuth2)
* The application need only support JSON and not the XML flavor of FHIR.
* The application shall create FHIR Documents and submit them via FHIR protocol to a FHIR server (will be provided)
* Validation of documents shall occur on the client. See https://github.com/HHSIDEAlab/provider-data-tools/tree/master/pdt/fhir_json_schema (these could possibly need tweaked)
