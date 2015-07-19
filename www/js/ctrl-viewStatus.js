app.controller('viewStatusCtrl', function($scope,Auth,$state,FURL,$stateParams) {
  $scope.team = Auth.team;

  var member = $stateParams.uid;
  console.log(member);
  var statusRef = new Firebase(FURL);
  var statusInfo = {};


  statusRef.child('team').child(Auth.team).child('task').child(member).on('value',function(data){
    data = data.val();
    statusInfo.city = data.city ? data.city : '';
    statusInfo.location = data.location ? data.location : '';
    statusInfo.name = data.name ? data.name :'';
    statusInfo.time = data.time ? data.time : '';
    statusInfo.weather = data.weather ? data.weather : '';
    console.log(statusInfo);
    statusRef.child('profile').child(member).on('value',function(data){
      data = data.val();
      statusInfo.gravatar = data.gravatar;
      console.log(statusInfo);
      $scope.statusInfo = statusInfo;
    });
  });

  $scope.goBack = function(){
    $state.go('teamArea');
  }

});
