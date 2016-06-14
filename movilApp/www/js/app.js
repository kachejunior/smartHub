// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter',
    [
        'ionic',
        'starter.controllers',
        'starter.services',
        'angular.circular-slider',
        'LocalStorageModule',
        'ngCordova'
    ])
    .factory('ConfigLocal', function () {
        return {
            host: 'http://smart.venericameat.com',
            all: function () {
                var projectString = window.localStorage['projects'];
                if (projectString) {
                    return angular.fromJson(projectString);
                }
                return [];
            },
            save: function (projects) {
                window.localStorage['projects'] = angular.toJson(projects);
            },
            newProject: function (projectTitle) {
                // Add a new project
                return {
                    title: projectTitle,
                    tasks: []
                };
            },
            getLastActiveIndex: function () {
                return parseInt(window.localStorage['lastActiveProject']) || 0;
            },
            setLastActiveIndex: function (index) {
                window.localStorage['lastActiveProject'] = index;
            }
        }
    })
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
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

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js

        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })


            // Each tab has its own nav history stack:

            .state('tab.panel', {
                url: '/panel',
                views: {
                    'tab-panel': {
                        templateUrl: 'templates/tab-panel.html',
                        controller: 'PanelCtrl'
                    }
                }
            })

            .state('tab.config', {
                url: '/config',
                views: {
                    'tab-config': {
                        templateUrl: 'templates/tab-config.html',
                        controller: 'ConfigCtrl'
                    }
                }
            })

            .state('tab.cam', {
                url: '/cam',
                views: {
                    'tab-panel': {
                        templateUrl: 'templates/tab-cam.html',
                        controller: 'CamCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/panel');

    })
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('smartHubConfig')
            .setNotify(true, true)
    }).run(function($ionicPlatform, $cordovaSQLite) {
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
            db = $cordovaSQLite.openDB("my.db");
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS users (id integer primary key, username text)");
        });
    })

;
