app.controller('viewStatusCtrl', function($scope,Auth,$state,FURL,$stateParams,$ionicModal,$ionicActionSheet,$ionicPlatform,$cordovaGoogleAnalytics) {
  $ionicPlatform.ready(function() {
    if (typeof analytics !== 'undefined'){
       $cordovaGoogleAnalytics.startTrackerWithId('UA-67596202-1');
  $cordovaGoogleAnalytics.trackView('View status screen');
  $cordovaGoogleAnalytics.setUserId(Auth.user.uid);
    }
  });
  

  $scope.history = 86400000;
  $scope.historyTitle = '24 hours';
  $scope.teamPlan = 'free';
  $scope.userAdmin = false;

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

    $scope.isAdmin = function(){
      if(member.uid != Auth.user.uid){
        statusRef.child('team').child(Auth.team).child('admin').once('value',function(data){
          data = data.val();
          if(data == Auth.user.uid){
            $scope.userAdmin = true;
          }else{
            $scope.userAdmin = false;
          }
        });
      }
      
    }
    $scope.getTeamPlan = function(){
      statusRef.child('team').child(Auth.team).child('plan').once('value', function(data){
        data = data.val();
        $scope.teamPlan = data;
      });
    }
    //Make task history

    $scope.changeHistoryTimeOffset = function(x){
      $scope.taskHistory = [];
      $scope.history = x;
      $scope.historyTitle = $scope.changeHistoryTitle(x);
      $scope.getTaskHistory();
      $scope.closeModal();
    }
    $scope.changeHistoryTitle = function(x){
      var r = ''
      switch(x){
        case 86400000:
          r = '24 Hours';
          break;
        case 604800000:
          r = '7 Days';
          break;
        case 2592000000:
          r = '30 Days';
          break;
        case 78892290000:
          r = '6 Months';
          break;  
        case 78892290001:
          r = 'All Time';
          break;     
      }
      return r;
    }

    $scope.getTaskHistory = function(){
      var startTime = new Date().getTime();
      var endTime = startTime - $scope.history;
      console.log(startTime);


      statusRef.child('team').child(Auth.team).child('all').child(member.uid).orderByChild('time').startAt(endTime).once('value',function(data){
        //console.log(data.val());
        //Clean up data
        data = data.val();
        if(data){
          var keys = Object.keys(data);
          var arr = [];
          for(var i = 0; i < keys.length;i++){
            arr.push(data[keys[i]]);
          }
          $scope.taskHistory = arr;
        }
        

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
  $scope.isAdmin();
  $scope.getTeamPlan();
  $scope.getTaskHistory();



  // Modal 
  
  $scope.openModal = function() {
    console.log('fire');
    if(typeof analytics !== "undefined") {
      $cordovaGoogleAnalytics.trackEvent('Profile','Change history timeframe');
    }
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



  //Action sheet - for admins only

   // Triggered on a button click, or some other target
 $scope.adminBar = function() {
    if(typeof analytics !== "undefined") {
      $cordovaGoogleAnalytics.trackEvent('Profile', 'Admin bar open');
    }
   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     // buttons: [
     //   { text: 'Make Admin' }
     // ],
     destructiveText: 'Delete User',
     destructiveButtonClicked : function(){
      if(typeof analytics !== "undefined") {
        $cordovaGoogleAnalytics.trackEvent('Profile', 'Deleted user');
      }
        //remove person from tasks
        var taskRef = new Firebase(FURL+'team/'+Auth.team+'/task/'+member.uid);

        taskRef.remove();

        //remove person from allowed members
        var memberRef = new Firebase(FURL+'team/'+Auth.team+'/members/'+member.uid);

        memberRef.remove();

        //insure that if their curTeam is set that its not set to the team
        statusRef.child('profile').child(member.uid).child('teams').once('value',function(data){
          data = data.val();
          keys = Object.keys(data);
          var arr = [];
          for(var i = 0; i < keys.length; i++){
            if(data[keys[i]] == Auth.team){
              continue;
            }
            arr.push(data[keys[i]]);
          }
          statusRef.child('profile').child(member.uid).child('teams').set(arr);
          $state.go('teamArea');
          return true;
        });

     },
     titleText: 'Admin area',
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
      console.log(index);
       return true;
     }
   });

   

 };

});
