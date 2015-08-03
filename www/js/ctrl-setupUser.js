'use strict';

app.controller('SetupUserCtrl', function($scope,Auth,$state) {

  $scope.regPerson = function(user){
    Auth.register(user).then(function() {
                console.log('login done');
            });
  }

  $scope.loginArea = function(){
    $state.go('loginUserDetails');
  }

});
