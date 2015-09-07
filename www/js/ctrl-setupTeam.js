app.controller('SetupTeamCtrl', function($scope,$state,Auth,$ionicHistory) {
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
