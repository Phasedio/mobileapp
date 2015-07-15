'use strict';

app.controller('LoginTeamNameCtrl', function($scope,$state,Auth,FURL, $firebaseAuth, $firebase) {

  $scope.enterTeam = function(team){
    Auth.team = team.name;
    console.log(Auth.team);
    $state.go('loginUserDetails');

  };
  $scope.makeTeam = function(){
    Auth.newTeam = true;
    $state.go('setupTeam');
  }

});
