'use strict';

app.controller('SetupUserCtrl', function($scope,Auth) {

  $scope.regPerson = function(user){
    Auth.register(user).then(function() {
                console.log('login done');
            });
  }

});
