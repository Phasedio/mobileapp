app.controller('viewStatusCtrl', function($scope,Auth,$state,FURL,$stateParams,$ionicModal) {

  $scope.history = 86400000;

  $ionicModal.fromTemplateUrl('templates/my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    console.log('got it');
    $scope.modal = modal;
  });
  $scope.team = Auth.team;
  $scope.taskHistory = [];

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
    //Make task history

    $scope.changeHistoryTimeOffset = function(x){
      $scope.taskHistory = [];
      $scope.history = x;
      $scope.getTaskHistory();
    }

    $scope.getTaskHistory = function(){
      var startTime = new Date().getTime();
      var endTime = startTime - $scope.history;
      console.log(startTime);


      statusRef.child('team').child(Auth.team).child('all').child(member.uid).orderByChild('time').startAt(endTime).once('value',function(data){
        //console.log(data.val());
        //Clean up data
        data = data.val();

        var keys = Object.keys(data);
        var arr = [];
        for(var i = 0; i < keys.length;i++){
          arr.push(data[keys[i]]);
        }
        $scope.taskHistory = arr;


      });
    };

    
    //weather


  $scope.goBack = function(){
    $state.go('teamArea');
  }

  $scope.getBetterImage = function(email){

    $scope.statusInfo.gravatar = Auth.biggerAvatar(email,100);
    console.log($scope.statusInfo.gravatar);
  }
  $scope.getTaskHistory();



  // Modal 
  
  $scope.openModal = function() {
    console.log('fire');
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });


});
