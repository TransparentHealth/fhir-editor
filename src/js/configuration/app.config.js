angular.module('fhir-editor').constant('APP_CONFIG', {
  /** Google OAuth Configuration **/
  apiKey: 'AIzaSyCX68Oqtu9WT5nJZAgoeasHJk91-3CmLCU',
  clientId: '482782208078-sqeem22p4objiuvviagvf6tios32l42a.apps.googleusercontent.com',

  /** API URL Configuration **/
  nppesSearchUrl: 'http://api.docdish.com/search/api/public/nppes/pjson/pjson.json',
  pecosSearchUrl: 'http://api.docdish.com/search/api/public/pecos/compiled/compiled.json',
  nppesUpdateUrl: 'http://api.docdish.com/write/api/ip/nppes-update',
  pecosUpdateUrl: 'http://api.docdish.com/write/api/ip/pecos-update',
  fhirUpdatePractitionerUrl: 'http://api.docdish.com/write/api/ip/update-Provider',

  /** Branding Configuration **/
  // Instructions Text
  instructionsText: 'Lorem ipsum dolor sit amet, ante ipsum vitae in vestibulum non malesuada. Pharetra venenatis gravida, condimentum sed risus, tortor nunc, eros ut volutpat sollicitudin sed amet integer, tempor volutpat tempor. Semper dui, nec eleifend porta mollis, et tellus ac quam non, porttitor nec volutpat mauris, tincidunt sed litora non nonummy.',
  // Mission/About Text
  missionAboutText: 'Lorem ipsum dolor sit amet, ante ipsum vitae in vestibulum non malesuada. Pharetra venenatis gravida, condimentum svd risus, tortor nunc, edos ut volutpat sollicitudin sed amet integer, tempor volutpat tempor. Semper dui, nec eleifend porta mollis, et tellus ac quam non, porttitor nec volutpat'
});
