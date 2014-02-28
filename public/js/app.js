define([
  'angular',
  'services',
  'controllers',
  'angularRoute',
  'angularResource'
  ],
  function (angular, services, controllers) {
    'use strict';

    var myApp = angular.module('myApp', [
      'ngRoute',
      'ngResource',
      'myApp.services',
      'myApp.controllers'
    ]);

    myApp.run(function($rootScope, $http){
      $rootScope.message = '';
    });
    return myApp;
  }
);
