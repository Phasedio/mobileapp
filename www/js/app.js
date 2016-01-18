'Use Strict';
angular.module('App', ['ionic','ngStorage', 'ngCordova','firebase','ngMessages','angularMoment'])
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
    .state('home', {
      url: '/home',
      templateUrl: 'views/home/home.html',
      controller:'homeController',
      resolve: {
                    // controller will not be loaded until $requireAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    'currentAuth': ['Auth', function(Auth) {
                      // $requireAuth returns a promise so the resolve waits for it to complete
                      // If the promise is rejected, it will throw a $stateChangeError (see above)
                      return Auth.fb.$requireAuth();
                    }]
                  }
    })
    .state('tasks', {
      url: '/tasks',
      templateUrl: 'views/tasks/tasks.html',
      controller:'TasksController'
    })
    .state('thisisatask', {
      url: '/thisisatask/:taskid',
      templateUrl: 'views/taskItem/taskItem.html',
      controller:'TasksIDController'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'views/profile/profile.html',
      controller:'ProfileController'
    })
    ;
$urlRouterProvider.otherwise("/home");
})
.run(['$rootScope', '$location', function ($rootScope, $location) {
      $rootScope.$on('$routeChangeError', function(event, next, previous, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        if (error === 'AUTH_REQUIRED') {
          $location.path("/login");
        }
      });

  }])
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
