app.controller('viewStatusCtrl', function($scope,Auth,$state,FURL,$stateParams) {
  $scope.team = Auth.team;

  var member = angular.fromJson($stateParams.uid);
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




    data = member;
    statusInfo.city = data.city ? data.city : '';
    statusInfo.location = data.location ? data.location : '';
    statusInfo.task = data.task ? data.task :'';
    statusInfo.time = data.time ? data.time : '';
    statusInfo.weather = data.weather ? data.weather : '';
    statusInfo.gravatar = data.gravatar + '&s=120';
    statusInfo.name = data.name;

    $scope.statusInfo = statusInfo;



    if(data.photo){
      $scope.bgColor = data.photo;
      $scope.filter = "background:rgba(0,0,0,0.5)";
    }else{
      $scope.bgColor = "background:" + colors[4];
      $scope.filter = ''
    }

    //weather


  $scope.goBack = function(){
    $state.go('teamArea');
  }

  $scope.getBetterImage = function(email){

    $scope.statusInfo.gravatar = Auth.biggerAvatar(email,100);
    console.log($scope.statusInfo.gravatar);
  }



});
