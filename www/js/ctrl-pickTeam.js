app.controller('PickTeamCtrl', function($scope,Auth,$state,FURL) {
  $scope.teamsAvail = Auth.memberOf;

  var ref = new Firebase(FURL);

  $scope.switchTeam = function(team){
    console.log('I head yeah');
    ref.child('team').child(team).child('members').once('value',function(data){
      data = data.val();
      console.log(Auth.user.uid);
      if(data[Auth.user.uid]){
        //User is allowed in
        $scope.team = [];
        Auth.team = team;
        $state.go('updateStatus');

      }
    })
  };
  $scope.createTeam = function(){
    $state.go('setupTeam');
  }
});
