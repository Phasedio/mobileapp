app.controller('PickTeamCtrl', function($scope,Auth,$state,FURL,Team,$cordovaGoogleAnalytics,$ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (typeof analytics !== 'undefined'){
      $cordovaGoogleAnalytics.startTrackerWithId('UA-67596202-1');
      $cordovaGoogleAnalytics.trackView('Pick Team screen');
      $cordovaGoogleAnalytics.setUserId(Auth.user.uid);
    }
  });
  
  $scope.teamsAvail = Auth.memberOf;

  var ref = new Firebase(FURL);

  $scope.switchTeam = function(team){

    ref.child('team').child(team).child('members').once('value',function(data){
      data = data.val();
      console.log(Auth.user.uid);
      if(data[Auth.user.uid]){
        //User is allowed in
        Team.removeTeam();
        Auth.team = team;
        $state.go('teamArea');

      }
    })
  };
  $scope.createTeam = function(){
    if(typeof analytics !== "undefined") {
      $cordovaGoogleAnalytics.trackEvent('Pick Team', 'created team');
    }
    $state.go('setupTeam');
  }

});
