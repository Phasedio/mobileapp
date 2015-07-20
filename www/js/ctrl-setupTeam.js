

app.controller('SetupTeamCtrl', function($scope,$state,Auth) {

  $scope.enterTeam = function(team){
    Auth.createTeam(team.name,Auth.user.uid);


  };

  $scope.loginTeam = function(){
    Auth.newTeam = 0;
    $state.go('loginTeamName');
  }

});
