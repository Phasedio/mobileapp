app.controller('teamCtrl', function($scope,Auth,$state,FURL) {
  $scope.team = [];
  $scope.teamName = Auth.team;
  $scope.teamsAvail = Auth.memberOf;
  $scope.$on('$ionicView.leave', function(){
    $scope.team = [];
    checkStatus();
  });
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
   $scope.nudge = function(id){
     id = id +'-nudge';
     document.getElementById(id).className =
       document.getElementById(id).className.replace( /(?:^|\s)nudgeHidden(?!\S)/g , '' );
     var myVar = setTimeout(function(){
      document.getElementById(id).className += ' nudgeHidden';
      clearTimeout(myVar);
    }, 1000);

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
               var pic,style;
               if(users[memberID].photo){
                style = "background:url("+users[memberID].photo+") no-repeat center center fixed; -webkit-background-size: cover;-moz-background-size: cover; -o-background-size: cover; background-size: cover";
               }
               var teamMember = {
                   name : p.name,
                   gravatar : p.gravatar,
                   task : users[memberID].name,
                   time : users[memberID].time,
                   uid : memberID,
                   photo:style
               };
               $scope.team.push(teamMember);
               $scope.$apply();
           });
   }


   // Amazon stuff
   $scope.creds          = {
       access_key: 'AKIAILCKFOBMOM3QQGSQ',
       secret_key: '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',
       bucket : 'phasedstorage'
   };

   function getPhoto(file){
     AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
     AWS.config.region = 'us-west-2';
     var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
     var param = {Key: file}
     bucket.getObject(param,function(err,data){
       if(err){
         alert(err);
       }else{
         alert('got it');
         return(data);
       }
     })
   }

});

app.controller('ContentController', function($scope,Auth,$state,FURL) {


});
