app.controller('teamCtrl', function($scope,Auth,$state,FURL) {
  $scope.team = [];
  $scope.teamName = Auth.team;

   new Firebase(FURL + 'team/' + Auth.team + '/task').on('value', function(users) {
     $scope.team = [];
     users = users.val();
     console.log(users);
     var teamUID = Object.keys(users);

        for (var i = 0; i < teamUID.length; i++) {
            getTeamMember(teamUID[i], users);
        }
   });
   $scope.compose = function(){
     $state.go('updateStatus');
   }
   $scope.seeStatus = function(id){
     console.log(Auth.user);
     if(id == Auth.user.uid){
       //show users own profile!
       $state.go('viewStatus',{uid:id});
     }else{
       $state.go('viewStatus',{uid:id});
     }
   }
   function getTeamMember(memberID, users){
     //console.log(users);
       var userrefs = new Firebase(FURL + 'profile/' + memberID);
       userrefs.once("value", function(data) {
               console.log(memberID);
               var p = data.val();
               console.log(p);
               var teamMember = {
                   name : p.name,
                   gravatar : p.gravatar,
                   task : users[memberID].name,
                   time : users[memberID].time,
                   uid : memberID
               };
               $scope.team.push(teamMember);
               $scope.$apply();
           });
   }
});

app.controller('ContentController', function($scope,Auth,$state,FURL) {

  
});
