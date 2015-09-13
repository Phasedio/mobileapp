app.controller('ProfileMainCtrl', function($scope,Auth,$state,FURL) {
  $scope.team = Auth.team;
  $scope.user = {};
  $scope.updates = [];
  $scope.stats = {};
  $scope.view ="posts";
  $scope.submitBtnText = 'Update';
  $scope.ogUser = '';


  var ref = new Firebase(FURL);

  ref.child('profile').child(Auth.user.uid).once('value',function(data){
    data = data.val();
    $scope.user = data;
    $scope.ogUser = data;
    console.log(data);
  });

  $scope.goBack = function(){ 
    $state.go('teamArea');
  }
  $scope.update = function(user){
    console.log('updating');
    console.log($scope.user);
    console.log($scope.ogUser);
    console.log('updating name');
    Auth.changeName(Auth.user.auth.uid, user.name);
     
    if(user.email != $scope.ogUser.email){
      console.log('updating email');
      if(!user.password){
        alert('to edit your email, please enter your password');
      }else{
        Auth.changeEmail(Auth.user.auth.uid,user.email, $scope.ogUser.email, user.password);
      }
      
    } 
    if(user.newPassword){
      var obj = {
        uid : Auth.user.auth.uid,
        email : user.email,
        oldPass : user.oldPassword,
        newPass : user.newPassword

      }
      Auth.changePassword(Auth.user.auth.uid, user.name).then(function(data){
        console.log(data);
      },function(data){
        console.log(data);
      });
    }

    $scope.submitBtnText = 'Updated';

  };
  $scope.logout = function(){
    Auth.logout();
  }

});
