

app.controller('SetupTeamCtrl', function($scope,$state,Auth) {

  $scope.loginTeam = function(){
    Auth.newTeam = false;
    $state.go('loginTeamName');
  }

});
