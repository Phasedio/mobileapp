<<<<<<< HEAD
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app =  angular.module('starter', [
  'ionic',
  'ionic.service.core',
  'ngCordova',
  'ionic.service.push',
  'starter.controllers',
  'starter.services',
  'angularMoment',
  'firebase'
]).constant('FURL', 'https://phaseddev.firebaseio.com/');

app.config(['$ionicAppProvider','$ionicConfigProvider', function($ionicAppProvider, $ionicConfigProvider) {

  $ionicConfigProvider.views.swipeBackEnabled(false);
  // Identify app
  $ionicAppProvider.identify({
    // The App ID for the server
    app_id: '32c45998',
    // The API key all services will use for this app
    api_key: '62e4043cdea5ff673f4a6dd3e752325ca57996fec97ffedc',
    dev_push: true
  });
}]);

// app.run(function($cordovaStatusbar) {
//   $cordovaStatusbar.overlaysWebView(true);
//   $cordovaStatusBar.style(3) //Black, opaque
// })

app.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});


app.factory('Cameraz', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}]);

app.run(function($ionicPlatform,$cordovaStatusbar) {

  $ionicPlatform.ready(function() {
    $cordovaPush.setBadgeNumber(null);
    //cordovaStatusbar.hide();
    
    Parse.initialize("S1R7aIPJPXKPPF2cOcFkJ9zluitibxyOjjvUZWfg", "Lf70hdqXJ1EZVRFdiMovRSnxFdQQ3DJSkXbHPoMy");

    //initPushwoosh();

    });
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      //StatusBar.styleDefault();
      //StatusBar.styleBlackOpaque();
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
=======
'Use Strict';
angular.module('App', ['ionic','ngStorage', 'ngCordova','firebase','ngMessages','angularMoment'])
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(3);
})
.run(['$rootScope', '$location', function ($rootScope, $location) {
      $rootScope.$on('$routeChangeError', function(event, next, previous, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        console.log('hi');
        console.log(error);
        if (error === 'AUTH_REQUIRED') {
          $location.path("/login");
        }
      });

  }])
.config(function($stateProvider, $urlRouterProvider) {
$stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'views/login/login.html',
      controller:'loginController'
    })
    .state('forgot', {
      url: '/forgot',
      templateUrl: 'views/forgot/forgot.html',
      controller:'forgotController'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'views/register/register.html',
      controller:'registerController'
    })

    .state('menu', {
      url: '/menu',
      abstract:true,
      templateUrl: 'views/menu.html',
      controller: 'homeController'
    })

    .state('menu.tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'views/tabs.html'
    })

    .state('menu.tab.home', {
      url: '/home',
      views: {
        'menu-tab-home': {
          templateUrl: 'views/home/home.html',
          controller: 'homeController',
          resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            'currentAuth': ['Auth', function (Auth) {
              // $requireAuth returns a promise so the resolve waits for it to complete
              // If the promise is rejected, it will throw a $stateChangeError (see above)
              //console.log(Auth.user.name);
              console.log(Auth);
              // $requireAuth returns a promise so the resolve waits for it to complete
              // If the promise is rejected, it will throw a $stateChangeError (see above)
              return Auth.fb.$requireAuth();

            }]
          }
        }
      }
    })

    .state('menu.tab.userHistory', {
      url: '/home/:userid',
      views: {
        'menu-tab-home': {
          templateUrl: 'views/home/userHistory.html',
          controller:'historyController'
        }
      }
    })

    .state('menu.tab.tasks', {
      url: '/tasks',
      views: {
        'menu-tab-tasks': {
          templateUrl: 'views/tasks/tasks.html',
          controller:'TasksController',
          resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            'currentAuth': ['Auth', function (Auth) {
              console.log(Auth);
              // $requireAuth returns a promise so the resolve waits for it to complete
              // If the promise is rejected, it will throw a $stateChangeError (see above)
              return Auth.fb.$requireAuth();
            }]
          }
>>>>>>> dev
        }
      }
    })

<<<<<<< HEAD
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
  .state('splash', {
    url: '/splash',
    views: {
      'phased': {
        templateUrl: 'templates/splash.html',
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
  .state('profileMain', {
    url: '/profileMain',
    views: {
      'phased': {
        templateUrl: 'templates/profile-main.html',
        controller: 'ProfileMainCtrl'
      }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('splash');

=======
    .state('menu.tab.taskItem', {
      url: '/tasks/:taskid',
      views: {
        'menu-tab-tasks': {
          templateUrl: 'views/tasks/taskItem.html',
          controller:'taskItemController',
          resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            'currentAuth': ['Auth', function (Auth) {
              console.log(Auth);
              // $requireAuth returns a promise so the resolve waits for it to complete
              // If the promise is rejected, it will throw a $stateChangeError (see above)
              return Auth.fb.$requireAuth();
            }]
          }
        }
      }
    })

    .state('menu.tab.projects', {
      url: '/projects',
      views: {
        'menu-tab-projects': {
          templateUrl: 'views/subProjects/subProjects.html',
          controller:'SubProjectsController'
        }
      }
    })

    .state('menu.tab.projectDetail', {
      url: '/projectDetail',
      views: {
        'menu-tab-projects': {
          templateUrl: 'views/subProjects/subProjectDetail.html',
          controller:'SubProjectsController'
        }
      }
    })

    .state('menu.tab.profile', {
      url: '/profile',
      views: {
        'menu-tab-profile': {
          templateUrl: 'views/profile/profile.html',
          controller: 'ProfileController',
          resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            'currentAuth': ['Auth', function (Auth) {
              console.log(Auth);
              // $requireAuth returns a promise so the resolve waits for it to complete
              // If the promise is rejected, it will throw a $stateChangeError (see above)
              return Auth.fb.$requireAuth();
            }]
          }
        }
      }
    });
$urlRouterProvider.otherwise("/login");
})

// Changue this for your Firebase App URL.
.constant('FURL', 'https://phaseddev.firebaseio.com/')
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
>>>>>>> dev
});
