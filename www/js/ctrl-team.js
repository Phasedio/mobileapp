app.controller('teamCtrl', function($scope,Auth,$state,FURL) {
  $scope.team = [];
  $scope.teamName = Auth.team;
  $scope.teamsAvail = Auth.memberOf;
  var ref = new Firebase(FURL);

   checkStatus();
   moment().format();

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
   $scope.signOut = function(){
     ref.unauth();
     //$state.go('setupTeam',{uid:id});
   }
   $scope.switchTeam = function(team){
     //double check that user is allowed in team area

     ref.child('team').child(team).child('members').once('value',function(data){
       data = data.val();
       if(data[Auth.user.uid]){
         //User is allowed in
         $scope.team = [];
         Auth.team = team;
         $scope.teamName = Auth.team;
         checkStatus();

       }
     })
   }

   $scope.addMember = function(){
     $state.go('memberAdd');
   }

   function checkStatus(){
     new Firebase(FURL + 'team/' + Auth.team + '/task').on('value', function(users) {
       $scope.team = [];
       users = users.val();
       console.log(users);
       if(users){
         var teamUID = Object.keys(users);

            for (var i = 0; i < teamUID.length; i++) {
                getTeamMember(teamUID[i], users);
            }
       }

     });
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
