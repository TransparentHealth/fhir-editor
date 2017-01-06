angular.module('fhir-editor').constant('APP_CONFIG', {
  /** Google OAuth Configuration **/
  apiKey: 'AIzaSyCX68Oqtu9WT5nJZAgoeasHJk91-3CmLCU',
  clientId: '482782208078-sqeem22p4objiuvviagvf6tios32l42a.apps.googleusercontent.com',

  /** API URL Configuration **/
  nppesSearchUrl: 'http://api.docdish.com/search/api/public/nppes/pjson/pjson.json',
  pecosSearchUrl: 'http://api.docdish.com/search/api/public/pecos/compiled/compiled.json',
  nppesUpdateUrl: 'http://api.docdish.com/write/api/ip/nppes-update',
  pecosUpdateUrl: 'http://api.docdish.com/write/api/ip/pecos-update',
  fhirUpdatePractitionerUrl: 'http://api.docdish.com/write/api/ip/update-Provider'

  /** Branding Configuration **/
  // Variables for product name, logo, and custom styling go here
});
