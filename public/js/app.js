define([
  'angular',
  'controllers',
  'angularRoute',
  'angularResource'
  ],
  function (angular, controllers) {
    'use strict';

    var myApp = angular.module('myApp', [
      'ngRoute',
      'ngResource',
      'myApp.controllers'
    ]);

    myApp.run(function($rootScope, $http){
      $rootScope.message = '';
    });
    return myApp;
  }
);
