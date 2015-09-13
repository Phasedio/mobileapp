

app.controller('LoginUserDetailsCtrl', function($scope,Auth,$state,$cordovaStatusbar) {
  // $cordovaStatusbar.overlaysWebView(true)
  //
  // $cordovaStatusBar.style(1);

  var oriPerson = angular.copy($scope.user);

  $scope.regPerson = function(user){
    Auth.login(user).then(function() {
      $scope.user = angular.copy(oriPerson);
      $scope.userForm.$setPristine();
                console.log('login done');
                $state.go('updateStatus');
            }, function(err){
              alert(err);
              alert('incorrect username/password');
            });
  }
  $scope.makeAccount = function(){
    $state.go('setupUser');
  }

  $scope.$on('$ionicView.leave', function(){

  });
});
