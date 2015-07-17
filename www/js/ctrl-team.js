app.controller('teamCtrl', function($scope,Auth,$state,FURL) {
  $scope.team = [];

   new Firebase(FURL + 'team/' + Auth.team + '/activities').on('value', function(users) {
     users = users.val();
     console.log(users);
     var teamUID = Object.keys(users);

        for (var i = 0; i < teamUID.length; i++) {
            getTeamMember(teamUID[i], users);
        }
   });

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
                   time : users[memberID].time
               };
               $scope.team.push(teamMember);
               $scope.$apply();
           });
   }
});
