'Use Strict';
angular.module('App').controller('homeController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup,$ionicModal, $ionicSideMenuDelegate, $firebaseObject, Auth, FURL, Utils,Phased) {
  var ref = new Firebase(FURL);
//console.log("this is where i'm at", Phased, Auth);
  $scope.status = {
    name : '',
    catKey : ''
  }

  $scope.logOut = function () {
      Auth.logout();
      $location.path("/login");
  }

  //Notifications
  $scope.showMenu = function(){
    $ionicSideMenuDelegate.toggleRight();
  };

  // PhasedProvider integrations
  // n.b.: categories now in Phased.team.categorySelect and in Phased.team.categoryObj (different structures)
  // n.b.: Phased.user.profile is a link to Phased.team.members[Auth.user.uid].profile;
  $scope.team = Phased.team;
  $scope.currentUser = Phased.user;
  $scope.assignments = Phased.assignments;
  //$scope.archive = Phased.archive;
  console.log('the current team is', $scope.team);

  // ensure view updates when new members are added
  // members data retrieved
  //$scope.$on('Phased:membersComplete', function() {
  //  $scope.$apply();
  //});

  // history retrieved
  //$scope.$on('Phased:historyComplete', function() {
  //  $scope.$apply();
  //  //console.log(Phased);
  //});


  //Add modal fucntions
  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.updateTask = function() {
    console.log('doing things');
    $scope.modal.show();
  };
  $scope.closeUpdateTask = function() {
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

  //add task
  // add a task
  // 1. format incoming data
  // 2. PhasedProvider pushes to db
  // 3. update interface
	$scope.addTask = function(update){
    console.log('we will update the task', update)


    // 1. format incoming status data
  	// if ($scope.taskForm.$error.maxlength){
  	// 	alert('Your update is too long!');
    //   return;
  	// }

    var key = update.catKey;
    var taskPrefix = '';

    var weather,city,lat,long,photo;

    key = update.catKey ? update.catKey : '';
    city = 0;
    lat =  0;
    long =  0;
    photo =  0;
    var status = {
      name: taskPrefix+update.name,
      time: new Date().getTime(),
      user:Auth.user.uid,
      cat : key,
      city:city,
      weather:'',
      taskPrefix : taskPrefix,
      photo : photo,
      location:{
        lat : lat,
        long : long
      }
    };

    // 2. update db
    Phased.addTask(status);

    // 3. update interface
    //$scope.task = update;
    $scope.status = {name:'',catKey:''};
    $scope.modal.hide();
    //$scope.taskTime = status.time; // we didnt have status.time so i think this fixes the problem(?)
	};


});
