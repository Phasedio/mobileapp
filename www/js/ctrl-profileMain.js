app.controller('ProfileMainCtrl', function($scope,Auth,$state,FURL,$cordovaGoogleAnalytics,$ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (typeof analytics !== 'undefined'){
       $cordovaGoogleAnalytics.startTrackerWithId('UA-67596202-1');
        $cordovaGoogleAnalytics.trackView('Profile screen');
        $cordovaGoogleAnalytics.setUserId(Auth.user.uid);
    }
  });

 

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
    $scope.ogUser = {
      name : $scope.user.name,
      email : $scope.user.email
    };
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
     console.log('check email');
     console.log($scope.user.email + ' ' + $scope.ogUser.email);
    if($scope.user.email != $scope.ogUser.email){
      console.log('updating email');
      if(!user.oldPassword){
        alert('to edit your email, please enter your password');
      }else{
        Auth.changeEmail(Auth.user.auth.uid,user.email, $scope.ogUser.email, user.oldPassword);
      }
      
    } 
    if(user.newPassword){
      console.log('updating password');
      var obj = {
        uid : Auth.user.auth.uid,
        email : user.email,
        oldPass : user.oldPassword,
        newPass : user.newPassword

      }
      console.log(obj);
      Auth.changePassword(obj).then(function(data){
        console.log(data);
      },function(data){
        console.log(data);
      });
    }
    $state.go('teamArea');

    $scope.submitBtnText = 'Updated';

  };
  $scope.logout = function(){
    Auth.logout();
  }

});
