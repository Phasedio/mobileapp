app.controller('ProfileMainCtrl', function($scope,Auth,$state,FURL) {
  $scope.team = Auth.team;
  $scope.user = {};
  var ref = new Firebase(FURL);

  ref.child('profile').child(Auth.user.uid).once('value',function(data){
    data = data.val();
    $scope.user = data;
  });


  $scope.seeStatus = function(id){
    console.log(id);
    id = angular.toJson(id);
    if(id == Auth.user.uid){
      //show users own profile!
      $state.go('viewStatus',{uid:id});
    }else{
      $state.go('viewStatus',{uid:id});
    }
  };
  $scope.goBack = function(){
    $state.go('teamArea');
  }

});
