app.factory('Team', function(FURL,Auth,$firebaseAuth,$firebase,$q,$state,$ionicHistory,$ionicUser,$ionicPush,$ionicPlatform,$rootScope,$firebaseObject) {
  var Team = {
    members : [],
    addMember : function(member){
      Team.members.push(member);
    },
    removeTeam : function(){
      Team.members = [];
    }
  }

  return Team;
});
