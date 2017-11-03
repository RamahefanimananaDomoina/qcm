
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])
  
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });

  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.login', {
        url: '/login',
        views: {
          'tab-login': {
            templateUrl: 'templates/tab-login.html',
            controller: 'LoginCtrl'
          }
        }
      })

      .state('tab.qcm', {
        url: '/qcm',
        views: {
          'tab-qcm': {
            templateUrl: 'templates/tab-qcm.html',
            controller: 'QcmCtrl'
          }
        }
      })

      .state('tab.cat', {
        url: '/cat',
        views: {
          'tab-cat': {
            templateUrl: 'templates/tab-cat.html',
            controller: 'CategoryCtrl'
          }
        }
      })
      .state('tab.resultat', {
        url: '/resultat',
        views: {
          'tab-resultat': {
            templateUrl: 'templates/tab-resultat.html',
            controller: 'BaremCtrl'
          }
        }
      })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('tab/login');
   
  });
