app.controller('teamCtrl', function($scope,Auth,Team,$state,FURL,$ionicHistory,$ionicUser,$ionicPush,$ionicPlatform,$rootScope,$http,$cordovaPush,$cordovaStatusbar) {
  //Team.checkStatus();
  $scope.team = [];
  $scope.teamName = Auth.team;
  $scope.teamsAvail = Auth.memberOf;
  $scope.user = Auth.user;


  var push = {};
  $scope.$on('$ionicView.leave', function(){

  });



  $scope.$on('$ionicView.enter', function(){
      Team.removeTeam();
      checkStatus();
      var ref2 = new Firebase(FURL);
      var isIOS = ionic.Platform.isIOS();
      var isAndroid = ionic.Platform.isAndroid();

      if(isIOS){

         push = {
          config : {
            "badge": true,
            "sound": true,
            "alert": true,
          },
          platform : 'ios'
        };
      }else if(isAndroid){

        push = {
         config : {
           "senderID": "578262937048",
         },
         platform : 'android'
       };
      }
      $cordovaPush.register(push.config).then(function(deviceToken) {
        // Success -- send deviceToken to server, and store for future use

        ref2.child('profile').child(Auth.user.uid).on('value',function(data){
          data = data.val();
          Auth.user.parse = data.parse;

          var address = 'http://45.55.200.34:8080/register/'+push.platform+'/'+deviceToken+'/'+data.parse+'/'+Auth.team;
          // Handle the senderID if the platform is android
          if(isAndroid){
            address = address +'/'+push.config.senderID;
          }else{
            address = address +'/'+0;
          }
          $http.get(address,'').success(function(data){

          });
        });


        ref.child('profile').child(Auth.user.uid).child('token').set(deviceToken);
        Auth.user.deviceToken = deviceToken;
      },function(err) {
      alert("Registration error: " + err)
    });


  });


  var ref = new Firebase(FURL);

  ref.child('profile').child(Auth.user.uid).once('value',function(data){
    data = data.val();
    $scope.user = data;
    ref.child('team').child(Auth.team).child('task').child(Auth.user.uid).once('value',function(data){
      data = data.val();
      $scope.user.task = data;
    });
  });


   moment().format();
   $scope.newTeam = function(){
     $state.go('pickTeam');
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

         $http.get('http://45.55.200.34:8080/register/'+Auth.user.deviceToken+'/'+Auth.user.parse+'/'+team,'').success(function(data){
           alert(data);
         });
         checkStatus();

       }
     })
   }
   $scope.nudge = function(id){
     alert(id);
     $http.get('http://45.55.200.34:8080/push/nudge/'+id+'/'+Auth.user.name,'').success(function(data){
       console.log(data);
     });


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
       Team.removeTeam();
       users = users.val();
       //console.log(users);
       if(users){
         var teamUID = Object.keys(users);
   
            for (var i = 0; i < teamUID.length; i++) {
                getTeamMember(teamUID[i], users);
            }
            $scope.team = Team.members;
            console.log($scope.team);
            $scope.$apply();
       }
   
     });
   }
   function getTeamMember(memberID, users){
     
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
               Team.addMember(teamMember);
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

function sendEmailNudge(sender){
  ref.child('profile').child(Auth.user.uid).once('value',function(data){
    user = data.val();
    msg = {
      "template_name" : 'nudge',
      "template_content": [

        {
          "name":'team_name',
          "content":Auth.team
        },
        {
          "name":'receiver_name',
          "content":user.name
        },
        {
          "name":'sender_name',
          "content":Auth.user.name
        },
        {
          "name":'sender_grav',
          "content":Auth.user.gravatar
        }

      ],
      "message" : {
        "from_email" : 'brian@phased.io',
        "from_name" : "Brian",
        'subject' : user.name+" is wondering what you're up to ",
        'global_merge_vars' : [
          {
            "name":'team_name',
            "content":Auth.team
          },
          {
            "name":'receiver_name',
            "content":user.name
          },
          {
            "name":'sender_name',
            "content":user.email
          },
          {
            "name":'sender_name',
            "content":user.email
          }
        ],
        'to' : [
          {
            'email' : names.email
          }
        ]
      }
    };
  });
}


});

app.controller('ContentController', function($scope,Auth,$state,FURL) {


});
