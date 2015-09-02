app.factory('Team', function(FURL,Auth,$firebaseAuth,$firebase,$q,$state,$ionicHistory,$ionicUser,$ionicPush,$ionicPlatform,$rootScope) {

  var Team = {
    'members':[],
    'checkStatus' : function(){
      new Firebase(FURL + 'team/' + Auth.team + '/task').on('value', function(users) {
        Team.members = [];
        users = users.val();
        if(users){
          var teamUID = Object.keys(users);
          //console.log(users);
             for (var i = 0; i < teamUID.length; i++) {
                 getTeamMember(teamUID[i], users);
             }
        }

        $rootScope.$apply();
        console.log(Team.members);
        
      });
    },
    'reset' : function(){
      Team.members = [];
      Team.checkStatus();
    }

  };
  return Team;




  function getTeamMember(memberID, users){


      var userrefs = new Firebase(FURL + 'profile/' + memberID);
      userrefs.once("value", function(data) {
              var p = data.val();

              var pic,style;
              if(users[memberID].photo){
               style = "background:url("+users[memberID].photo+") no-repeat center center fixed; -webkit-background-size: cover;-moz-background-size: cover; -o-background-size: cover; background-size: cover";
             }else{
               style = false;
             }
              var teamMember = {
                  name : p.name,
                  gravatar : p.gravatar,
                  task : users[memberID].name,
                  time : users[memberID].time,
                  weather:users[memberID].weather,
                  city:users[memberID].city,
                  uid : memberID,
                  photo:style
              };
              Team.members.push(teamMember);
          });
  }
});
