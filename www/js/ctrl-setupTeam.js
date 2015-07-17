

app.controller('SetupTeamCtrl', function($scope,$state,Auth) {

  $scope.enterTeam = function(team){
    Auth.team = team.name;
    console.log(Auth.team);
    $state.go('loginUserDetails');

  };

  $scope.loginTeam = function(){
    Auth.newTeam = 0;
    $state.go('loginTeamName');
  }

});
