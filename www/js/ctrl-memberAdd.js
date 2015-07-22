app.controller('memberAddCtrl', function($scope,Auth,$state,FURL) {
  var ref = new Firebase(FURL);
  $scope.addMembers = function(names){
    // grab all users and see if they match an email in the system
    ref.child('profile').once('value', function(data){
      data = data.val();
      for(var i = 0; i < names.length; i++){
        // if this email matches the one from the profile page assign this team to their account
        for(var y = 0; y < data.length; y++){
          if(names[i] == data[y].email){
            data.
          }
        }

        // if no matches are found create a profile-in-waiting with this team assigned.
      }
    });

  }
});
