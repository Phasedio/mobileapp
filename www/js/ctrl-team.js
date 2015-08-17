app.controller('teamCtrl', function($scope,Auth,$state,FURL,$ionicHistory,$ionicUser,$ionicPush,$ionicPlatform,$rootScope,$http,$cordovaPush) {
  $scope.team = [];
  $scope.teamName = Auth.team;
  $scope.teamsAvail = Auth.memberOf;
  $scope.$on('$ionicView.leave', function(){
    $scope.team = [];
    checkStatus();
  });

  // if(!Auth.isReg){
  //   Auth.regUsers();
  //   Auth.isReg = 1;
  // }

  var iosConfig = {
  "badge": true,
  "sound": true,
  "alert": true,
  };
  $scope.$on('$ionicView.enter', function(){
      var ref2 = new Firebase(FURL);
      $cordovaPush.register(iosConfig).then(function(deviceToken) {
        // Success -- send deviceToken to server, and store for future use
        alert("deviceToken: " + deviceToken);

        ref2.child('profile').child(Auth.user.uid).on('value',function(data){
          data = data.val();
          $http.get('http://45.55.200.34:8080/register/'+deviceToken+'/'+data.parse,'').success(function(data){
            alert(data);
          });
        })


        ref.child('profile').child(Auth.user.uid).child('token').set(deviceToken);
      },function(err) {
      alert("Registration error: " + err)
    });

  });


  var ref = new Firebase(FURL);

   checkStatus();
   moment().format();
   $scope.newTeam = function(){
     $state.go('setupTeam');
   }
   $scope.compose = function(){
     $state.go('updateStatus');
   }
   $scope.viewProfile = function(){
     $state.go('profileMain');
   }
   $scope.seeStatus = function(id){
     console.log(id);
     id = angular.toJson(id);
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
     alert(id);
     $http.get('http://45.55.200.34:8080/push/nudge/'+id,'').success(function(data){
            alert(data);
      });
    //  ref.child('profile').child(id).on('value', function(data){
    //    data = data.val();
    //    if(data.token){
    //      $http.get('http://45.55.200.34:8080/hello/'+data.token,'').success(function(data){
    //        alert(data);
    //      });
    //    }
    //  })

     id = id +'-nudge';
     document.getElementById(id).className =
       document.getElementById(id).className.replace( /(?:^|\s)nudgeHidden(?!\S)/g , '' );
     var myVar = setTimeout(function(){
      document.getElementById(id).className += ' nudgeHidden';
      clearTimeout(myVar);
    }, 1000);

   }

   $scope.setColor = function(time){
     var curTime = new Date();
     var difTime = curTime - time;
     if(difTime < 14400000){
       return 'greenClock'
     }else if(difTime > 14400000 && difTime < 43200000){
       return 'yellowClock'
     }else{
       return 'redClock'
     }
   }
   $scope.addMember = function(){
     $state.go('memberAdd');
   }

   function checkStatus(){
     new Firebase(FURL + 'team/' + Auth.team + '/task').on('value', function(users) {
       $scope.team = [];
       users = users.val();
       //console.log(users);
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
               //console.log(memberID);
               var p = data.val();
               //console.log(p);
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
               $scope.team.push(teamMember);
               $scope.$apply();
           });
   }


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
// =============================================================================
// PUSH NOTIFICATIONS
// =============================================================================
   //idPerson('brian','brian@phased.io');
   //regUsers();


   function idPerson(name, email) {
     console.log('Ionic User: Identifying with Ionic User service');

     var user = $ionicUser.get();
     if(!user.user_id) {
       // Set your user_id here, or generate a random one.
       user.user_id = $ionicUser.generateGUID();
     };

     // Add some metadata to your user object.
     angular.extend(user, {
       name: name,
       bio: email
     });

     // Identify your user with the Ionic User Service
     $ionicUser.identify(user).then(function(){
        $scope.identified = true;
       //alert('Identified user ' + user.name + '\n ID ' + user.user_id);
     });
  };

  $scope.regUsers = function(){
    alert('Ionic Push: Registering user');

    // Register with the Ionic Push service.  All parameters are optional.
    $ionicPush.register({
      canShowAlert: true, //Can pushes show an alert on your screen?
      canSetBadge: true, //Can pushes update app icon badges?
      canPlaySound: true, //Can notifications play a sound?
      canRunActionsOnWake: true, //Can run actions outside the app,
      onNotification: function(notification) {
        // Handle new push notifications here
        // console.log(notification);
        alert(notification);
        return true;
      }
    });

}


});

app.controller('ContentController', function($scope,Auth,$state,FURL) {


});
