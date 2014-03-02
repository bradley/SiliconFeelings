define([
  'angular',
  'services',
  'directives',
  'controllers',
  'angularRoute',
  'angularResource'
  ],
  function(angular, services, directives, controllers) {
    'use strict';

    var myApp = angular.module('myApp', [
      'ngRoute',
      'ngResource',
      'myApp.services',
      'myApp.directives',
      'myApp.controllers'
    ]);

    myApp.run(function($rootScope, $http){
      $rootScope.message = '';
    });
    return myApp;
  }
);
