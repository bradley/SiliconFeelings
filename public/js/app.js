define([
  'angular',
  'services',
  'directives',
  'controllers',
  '_',
  'angularRoute',
  'angularResource'
  ],
  function(angular, services, directives, controllers, _) {
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
