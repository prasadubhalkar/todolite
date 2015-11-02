var db = null;

var todoApp = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services']);

todoApp.run(function($ionicPlatform,$cordovaSQLite,$window) {

	$ionicPlatform.ready(function() {

      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        	cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        	cordova.plugins.Keyboard.disableScroll(true);
      }
      
      if (window.StatusBar) {
        	StatusBar.styleLightContent();         	// org.apache.cordova.statusbar required
      }

      if(window.cordova) {
        	db = $cordovaSQLite.openDB("todo.db");
      } 
      else {
        	db = window.openDatabase("todo.db", "1.0", "Todo app", -1);
      }
      
      $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS goals (id integer primary key, name text, completed integer)");
   });
});


todoApp.config(function($stateProvider , $urlRouterProvider) {

  	var stateProvider = $stateProvider;

  	stateProvider.state('tab', {
    	url: '/tab',
    	abstract: true,
    	templateUrl: 'templates/tabs.html'
  	});

  	stateProvider.state('tab.dash', {
    	url: '/dash',
    	views: {
      	'tab-dash': {
        		templateUrl: 'templates/tab-dash.html',
        		controller: 'DashCtrl'
      	}
    	}
  	});

  	stateProvider.state('tab.goals', {
      url: '/goals',
      views: {
        	'tab-goals': {
         	templateUrl: 'templates/tab-goals.html',
          	controller: 'GoalsCtrl'
        	}
      }
   });

  	stateProvider.state('tab.settings', {
    	url: '/settings',
    	views: {
      	'tab-settings': {
        		templateUrl: 'templates/tab-settings.html',
        		controller: 'SettingsCtrl'
      	}
    	}
  	});

  	$urlRouterProvider.otherwise('/tab/goals');
});
