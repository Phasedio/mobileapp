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

    .state('menu.tab.tasks', {
      url: '/tasks',
      views: {
        'menu-tab-tasks': {
          templateUrl: 'views/tasks/tasks.html',
          controller:'TasksController'
        }
      }
    })

    .state('menu.tab.taskItem', {
      url: '/tasks/:taskid',
      views: {
        'menu-tab-tasks': {
          templateUrl: 'views/taskItem/taskItem.html',
          controller:'TasksIDController'
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
});
