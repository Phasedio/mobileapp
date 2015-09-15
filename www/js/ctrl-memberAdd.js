app.controller('memberAddCtrl', function($scope,Auth,$state,FURL,$ionicHistory,$cordovaGoogleAnalytics,$ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (typeof analytics !== 'undefined'){
      $cordovaGoogleAnalytics.startTrackerWithId('UA-67596202-1');
      $cordovaGoogleAnalytics.trackView('Add member screen');
      $cordovaGoogleAnalytics.setUserId(Auth.user.uid);
    }
  });
  
  console.log(Auth.user);
  var user;
  var msg = {}

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };

  var ref = new Firebase(FURL);
  ref.child('profile').child(Auth.user.uid).once('value',function(data){
    user = data.val();
    msg = {
      "template_name" : 'invite',
      "template_content": [

          {
            "name":'team_name',
            "content":Auth.team
          },
          {
            "name":'inviter_name',
            "content":user.name
          },
          {
            "name":'inviter_email',
            "content":user.email
          }

      ],
      "message" : {
        "from_email" : 'brian@phased.io',
        "from_name" : "Brian",
        'subject' : user.name+" has invited you to " + Auth.team,
        'global_merge_vars' : [
          {
            "name":'team_name',
            "content":Auth.team
          },
          {
            "name":'inviter_name',
            "content":user.name
          },
          {
            "name":'inviter_email',
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



  console.log(user);


  $scope.addMembers = function(names){
    if(typeof analytics !== "undefined") {
      $cordovaGoogleAnalytics.trackEvent('Add member', 'sent invites out');
    }
    // grab all users and see if they match an email in the system
    console.log('test');
    ref.child('profile').once('value', function(data){
      data = data.val();
      console.log('test1');
      var selectedUID = Object.keys(data);
      var isSet = false;

      // if this email matches the one from the profile page assign this team to their account
      for(var y = 0; y < selectedUID.length; y++){
        console.log('test3');
        if(names.email == data[selectedUID[y]].email){
          isSet = true;
          //get the key of the uid
          console.log('test5');
          //push new team to member
          ref.child('profile').child(selectedUID[y]).child('teams').push(Auth.team);
          break;
        }
      }
      // if no matches are found create a profile-in-waiting with this team assigned.
      if(!isSet){
        console.log(names.email);
        // loop profile-in-waiting to find a match
        ref.child('profile-in-waiting').once('value', function(data){
          data = data.val();
          var selectedUID = Object.keys(data);
          var thisSet = false;
          for(var y = 0; y < selectedUID.length; y++){
            console.log(data[selectedUID[y]].email);
            if(names.email == data[selectedUID[y]].email){
              thisSet = true;
              //check if email already has team attached
              var userTeams = Object.keys(data[selectedUID[y]].teams);
              var profileOfUser = data[selectedUID[y]];
              var change = false;

              for(var u = 0; u < userTeams.length; u++){
                if(profileOfUser.teams[userTeams[u]] == Auth.team){
                  break;
                }else{
                  change = true;
                  break;
                }
              }
              if(change){
                //push new team to member
                ref.child('profile-in-waiting').child(selectedUID[y]).child('teams').push(Auth.team);
                sendTheMail(msg);
                break;
              }
            }
          }
          if(!thisSet){
            ref.child('profile-in-waiting').push({teams : { 0 : Auth.team},email : names.email});


            sendTheMail(msg);
          }
        });
      }
    });

  }


  //Send Mandrill Email

    // Create a function to log the response from the Mandrill API
    function sendTheMail(p) {
            var m = new mandrill.Mandrill('B0N7XKd4RDy6Q7nWP2eFAA');
            // Send the email!
            console.log('Sending mails');
            m.messages.sendTemplate(p, function(res) {
                log(res);
            }, function(err) {
                log(err);
            });
        };
    //Mandrill responce handler
    function log(obj) {
        console.log('Handling response');
        console.log(obj);
        //$('#response').text(JSON.stringify(obj));
    };

});
