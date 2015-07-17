app.controller('updateStatusCtrl', function($scope,Auth,$state,FURL) {
  $scope.updateStatus = '';

  $scope.submitStatus = function(update){
    var team = Auth.team;
    var status = {
      name: update,
      time: new Date().getTime(),
      user:Auth.user.uid
    };
    var teamRef = new Firebase(FURL);
    console.log(status);
    teamRef.child('team').child(team).child('activities').child(Auth.user.uid).set(status);
    console.log('status set');
    $state.go('teamArea');
  }

});
