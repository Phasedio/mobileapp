app.controller('SetupTeamCtrl', function($scope,$state,Auth,$ionicHistory,$cordovaGoogleAnalytics,$ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (typeof analytics !== 'undefined'){
       $cordovaGoogleAnalytics.startTrackerWithId('UA-67596202-1');
      $cordovaGoogleAnalytics.trackView('Setup team screen');
    }
  });
  
  
  $scope.team = {
  	name : ''
  };
  $scope.submitVal = 'Create team';

  var oriTeam = angular.copy($scope.team);

  $scope.enterTeam = function(team){
    var x = Auth.createTeam(team.name,Auth.user.uid);
    if(!x){
    	$scope.noTeam = 'Team name not available!';
    	$scope.team = angular.copy(oriTeam);
      $scope.teamForm.$setPristine();
    }

  };

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };

  $scope.loginTeam = function(){
    Auth.newTeam = 0;
    $state.go('loginTeamName');
  }
 
});
