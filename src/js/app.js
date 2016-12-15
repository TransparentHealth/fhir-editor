(function() {
  "use strict";

  angular.module('fhir-editor', ['ui.router', 'LocalStorageModule'])
        .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
          // Future reference: locationProvider can allow for the use of html5
          // pushState mode, which removes the unnecessary hashtag from the url.
          // Needs some backend rerouting to work with page refreshes, though.
          // Using locationProvider also requires setting a <base> url in the
          // index.html <head> tag, or else setting requireBase: false.

          $urlRouterProvider.otherwise('/');

          $stateProvider.state('home', {
            abstract: true,
            url: '/',
            templateUrl: './src/views/home.html',
            controller: 'homeCtrl as home'
          }).state('home.base', {
            url: '',
            templateUrl: './src/views/base.html',
            controller: 'baseCtrl as base'
          }).state('home.affiliations', {
            url: 'affiliations',
            templateUrl: './src/views/affiliations.html',
            controller: 'affiliationsCtrl as affiliations'
          }).state('home.addresses', {
            url: 'addresses',
            templateUrl: './src/views/addresses.html',
            controller: 'addressesCtrl as addresses'
          }).state('home.specialties', {
            url: 'specialties',
            templateUrl: './src/views/specialties.html',
            controller: 'specialtiesCtrl as specialties'
          }).state('home.taxonomies', {
            url: 'taxonomies',
            templateUrl: './src/views/taxonomies.html',
            controller: 'taxonomiesCtrl as taxonomies',
          }).state('home.licenses', {
            url: 'licenses',
            templateUrl: './src/views/licenses.html',
            controller: 'licensesCtrl as licenses'
          }).state('home.notes', {
            url: 'notes',
            templateUrl: './src/views/notes.html',
            controller: 'notesCtrl as notes'
          }).state('home.submit', {
            url: 'submit',
            templateUrl: './src/views/submit.html',
            controller: 'submitCtrl as submit'
          });
        });
})();
