app.controller('viewStatusCtrl', function($scope,Auth,$state,FURL,$stateParams) {
  $scope.team = Auth.team;

  var member = $stateParams.uid;
  console.log(member);
  var statusRef = new Firebase(FURL);
  var statusInfo = {};
  var colors = [
    '#0288D1',
    '#03A9F4',
    '#E040FB',
    '#673AB7',
    '#009688',
    '#388E3C',
    '#4CAF50',
    '#8BC34A'
  ];
  $scope.bgColor = colors[4];


  statusRef.child('team').child(Auth.team).child('task').child(member).on('value',function(data){
    data = data.val();
    statusInfo.city = data.city ? data.city : '';
    statusInfo.location = data.location ? data.location : '';
    statusInfo.task = data.name ? data.name :'';
    statusInfo.time = data.time ? data.time : '';
    statusInfo.weather = data.weather ? data.weather : '';
    console.log(statusInfo);
    statusRef.child('profile').child(member).on('value',function(data){
      data = data.val();
      statusInfo.name = data.name;
      statusInfo.gravatar = data.gravatar;
      console.log(statusInfo);
      $scope.statusInfo = statusInfo;
    });
  });

  $scope.goBack = function(){
    $state.go('teamArea');
  }

});
