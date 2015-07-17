// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app =  angular.module('starter', [
  'ionic',
  'starter.controllers',
  'starter.services',
  'firebase'
]).constant('FURL', 'https://phasedapi.firebaseio.com/');

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  // Phased states


  .state('loginTeamName', {
    url: '/loginTeamName',
    views: {
      'phased': {
        templateUrl: 'templates/login-teamname.html',
        controller: 'LoginTeamNameCtrl'
      }
    }
  })
  .state('loginUserDetails', {
    url: '/loginUserDetails',
    views: {
      'phased': {
        templateUrl: 'templates/login-userdetails.html',
        controller: 'LoginUserDetailsCtrl'
      }
    }
  })
  .state('setupTeam', {
    url: '/setupTeam',
    views: {
      'phased': {
        templateUrl: 'templates/setup-team.html',
        controller: 'SetupTeamCtrl'
      }
    }
  })
  .state('setupUser', {
    url: '/setupUser',
    views: {
      'phased': {
        templateUrl: 'templates/setup-user.html',
        controller: 'SetupUserCtrl'
      }
    }
  })
  .state('updateStatus', {
    url: '/updateStatus',
    views: {
      'phased': {
        templateUrl: 'templates/update-compose.html',
        controller: 'updateStatusCtrl'
      }
    }
  })
  .state('teamArea', {
    url: '/teamArea',
    views: {
      'phased': {
        templateUrl: 'templates/team-area.html',
        controller: 'teamCtrl'
      }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('loginTeamName');

});
