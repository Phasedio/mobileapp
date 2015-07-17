

app.controller('LoginUserDetailsCtrl', function($scope,Auth,$state) {

  $scope.regPerson = function(user){
    Auth.login(user).then(function() {
                console.log('login done');
                $state.go('updateStatus');
            });
  }
  $scope.makeAccount = function(){
    $state.go('setupUser');
  }

});
