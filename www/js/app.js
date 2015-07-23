// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app =  angular.module('starter', [
  'ionic',
  'ngCordova',
  'ionic.service.core',
  'ionic.service.push',
  'starter.controllers',
  'starter.services',
  'firebase'
]).constant('FURL', 'https://phaseddev.firebaseio.com/');

app.config(['$ionicAppProvider', function($ionicAppProvider) {
  // Identify app
  $ionicAppProvider.identify({
    // The App ID for the server
    app_id: '32c45998',
    // The API key all services will use for this app
    api_key: '62e4043cdea5ff673f4a6dd3e752325ca57996fec97ffedc',
    dev_push: true
  });
}]);

app.run(function($ionicPlatform) {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
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
  .state('pickTeam', {
    url: '/pickTeam',
    views: {
      'phased': {
        templateUrl: 'templates/pick-team.html',
        controller: 'PickTeamCtrl'
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
  .state('viewStatus', {
    url: '/viewStatus/:uid',
    views: {
      'phased': {
        templateUrl: 'templates/status-view.html',
        controller: 'viewStatusCtrl'
      }
    }
  })
  .state('memberAdd', {
    url: '/memberAdd',
    views: {
      'phased': {
        templateUrl: 'templates/member-add.html',
        controller: 'memberAddCtrl'
      }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('loginUserDetails');

});
