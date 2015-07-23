app.controller('memberAddCtrl', function($scope,Auth,$state,FURL) {
  var ref = new Firebase(FURL);
  $scope.addMembers = function(names){
    // grab all users and see if they match an email in the system
    names = [names.email];
    ref.child('profile').once('value', function(data){
      data = data.val();
      var selectedUID = Object.keys(data);
      for(var i = 0; i < names.length; i++){
        var isSet = false;
        // if this email matches the one from the profile page assign this team to their account
        for(var y = 0; y < selectedUID.length; y++){
          if(names[i] == data[selectedUID[y]].email){
            isSet = true;
            //get the key of the uid

            //push new team to member
            ref.child('profile').child(selectedUID[y]).child('teams').push(Auth.team);
          }
        }
        // if no matches are found create a profile-in-waiting with this team assigned.
        if(!isSet){
          ref.child('profile-in-waiting').child(name[i]).child('teams').push(Auth.team);
        }

        // Send email notification.

      }
    });

  }
});
