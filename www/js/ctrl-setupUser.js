'use strict';

app.controller('SetupUserCtrl', function($scope,Auth,$state,$cordovaGoogleAnalytics,$ionicPlatform) {
	$ionicPlatform.ready(function() {
    if (typeof analytics !== 'undefined'){
       $cordovaGoogleAnalytics.startTrackerWithId('UA-67596202-1');
  $cordovaGoogleAnalytics.trackView('Setup new user screen');
    }
  });
	

  $scope.regPerson = function(user){
  	if(typeof analytics !== "undefined") {
  		$cordovaGoogleAnalytics.trackEvent('New User', 'registered new user');
  	}
    Auth.register(user).then(function() {
                console.log('login done');
            });
  }

  $scope.loginArea = function(){
    $state.go('loginUserDetails');
  }

});
