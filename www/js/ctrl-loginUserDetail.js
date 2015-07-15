

app.controller('LoginUserDetailsCtrl', function($scope,Auth) {

  $scope.regPerson = function(user){
    user.name = "brian";
    Auth.register(user).then(function() {
        console.log(Auth.user);
      }, function(err) {
          alert(err);
      });
  }

});
