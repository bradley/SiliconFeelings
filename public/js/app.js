define([
  'angular',
  'services',
  'directives',
  'controllers',
  '_',
  '$',
  'circlemouse',
  'angularRoute',
  'angularResource',
  'angularAnimate'
  ],
  function(angular, services, directives, controllers, _, $, circlemouse) {
    'use strict';

    var myApp = angular.module('myApp', [
      'ngRoute',
      'ngResource',
      'ngAnimate',
      'myApp.services',
      'myApp.directives',
      'myApp.controllers'
    ]);

    myApp.run(function($rootScope, $http){

      // Log a love note to our users.
      console.log('%c Hey there, lovely.', 'font-size: 14px; color: #264CCA');
    });
    return myApp;
  }
);
