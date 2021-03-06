define([
  'angular',
  'services',
  'directives',
  'controllers',
  '_',
  'circlemouse',
  'angularRoute',
  'angularResource',
  'angularAnimate'
  ],
  function(angular, services, directives, controllers, _, circlemouse) {
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
      $rootScope.artificial_timeout_time = 2900;
      $rootScope.page_view_count = 0;
      $rootScope.earthResourcesLoaded = false;

      // Log a love note to our users.
      console.log("%c Hey there, lovely. If you'd like to view the full source code, you can do so here: https://github.com/bradley/SiliconFeelings", 'font-size: 14px; color: #264CCA');
    });
    return myApp;
  }
);
