app.controller('PickTeamCtrl', function($scope,Auth,$state,FURL,Team) {
  $scope.teamsAvail = Auth.memberOf;

  var ref = new Firebase(FURL);

  $scope.switchTeam = function(team){

    ref.child('team').child(team).child('members').once('value',function(data){
      data = data.val();
      console.log(Auth.user.uid);
      if(data[Auth.user.uid]){
        //User is allowed in
        Team.reset();
        Auth.team = team;
        $state.go('teamArea');

      }
    })
  };
  $scope.createTeam = function(){
    $state.go('setupTeam');
  }

});
