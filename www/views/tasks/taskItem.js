'Use Strict';
/**
 *
 * allows ordering an object as if it were an array,
 * at the cost of being able to access its original index
 * Adds a property 'key' with the original index to
 * address this
 *
 */
 angular.module('App').filter('orderObjectBy', function() {
   return function(items, field, reverse) {
     var filtered = [];
     for (var i in items) {
       items[i].key = i;
       filtered.push(items[i]);
     }
     filtered.sort(function (a, b) {
       return (a[field] > b[field] ? 1 : -1);
     });
     if(reverse) filtered.reverse();
     return filtered;
   };
 })/**
   * filters tasks by status
   *
   * (preface statusID with ! to filter out statuses)
   */
   .filter('filterTaskByStatus', function() {
     return function(input, statusID) {
       if (!input) return input;
       if (!statusID) return input;
       var expected = ('' + statusID).toLowerCase(); // compare lowercase strings
       var result = {}; // output obj

       if (expected[0] === '!') {
         expected = expected.slice(1); // remove leading !
         // negative filter -- filter out tasks with status
         angular.forEach(input, function(value, key) {
           var actual = ('' + value.status).toLowerCase(); // current task's status
           if (actual !== expected) {
             result[key] = value; // preserves index
           }
         });
       } else {
         // only include tasks with status
         angular.forEach(input, function(value, key) {
           var actual = ('' + value.status).toLowerCase(); // current task's status
           if (actual === expected) {
             result[key] = value; // preserves index
           }
         });
       }

       return result;
     }
   })
   /**
   * filters tasks by category
   *
   * (preface statusID with ! to filter out statuses)
   */
   .filter('filterTaskByCategory', function() {
     return function(input, catID) {
       if (!input) return input;
       if (!catID) return input;
       var expected = ('' + catID).toLowerCase(); // compare lowercase strings
       var result = {}; // output obj

       if (expected[0] === '!') {
         expected = expected.slice(1); // remove leading !
         // negative filter -- filter out tasks with cat
         angular.forEach(input, function(value, key) {
           var actual = ('' + value.cat).toLowerCase(); // current task's cat
           if (actual !== expected) {
             result[key] = value; // preserves index
           }
         });
       } else {
         // only include tasks with cat
         angular.forEach(input, function(value, key) {
           var actual = ('' + value.cat).toLowerCase(); // current task's cat
           if (actual === expected) {
             result[key] = value; // preserves index
           }
         });
       }

       return result;
     }
   });

angular.module('App').controller('taskItemController', function ($scope, $state,$cordovaOauth, $rootScope, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils,Phased, $cordovaCamera, $stateParams) {
  //alert('HEY IM HERE CAN YOU SEE ME!!!!!!');

  $scope.archive = Phased.archive;
  $scope.viewType = Phased.viewType;
    $scope.taskPriorities = Phased.TASK_PRIORITIES; // in new task modal
    $scope.taskStatuses = Phased.TASK_STATUSES; // in new task modal
    $scope.taskPriorityID = Phased.TASK_PRIORITY_ID;
    $scope.taskStatusID = Phased.TASK_STATUS_ID;
    $scope.myID = Auth.user.uid;
  $scope.activeStream = Phased.assignments.to_me;
  $scope.activeStreamName = 'assignments.to_me';
  $scope.activeStatusFilter = '!1'; // not completed tasks
  $scope.filterView = $scope.activeStreamName;//for the select filter

  $scope.task = $rootScope.tasks[$stateParams.taskid];
  $scope.taskid = $stateParams.taskid;

  console.log($scope.task, $scope.taskid);

  var myDate = new Date($scope.task.deadline);
  $scope.task.due = myDate.toDateString();

  $scope.openCamera = function(){
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(photo) {
      $scope.task.image = "data:image/jpeg;base64," + photo;
      savePhoto($scope.task.image);
      $firebaseObject
      //right away save?
    })

    function savePhoto(image){
      console.log('we are going to save the photo to the database');

    }

  }

  if ($scope.task.priority==2){
    $scope.priority = "Low";
  } else if ($scope.task.priority==1){
    $scope.priority = "Medium";
  } else {
    $scope.priority = "High";
  }

  if($scope.task.status == 0){
    $scope.status = "In Progress";
  } else {
    $scope.status = "Assigned";
  }

  $scope.taskStart = function(taskid, task){
    console.log('starting the task', taskid, task);
    Phased.activateTask(taskid, task)
  }

  $scope.taskComments = function(){
    console.log('we will set up comments section');
  }

  $scope.taskFinish = function(taskid, task){
    console.log('we will complete task', taskid, task);
    Phased.setTaskStatus(taskid, Phased.task.STATUS_ID.COMPLETE)
  }

  $scope.$on('Phased:membersComplete', function() {
    $scope.$apply();
  });

  // history retrieved
  $scope.$on('Phased:historyComplete', function() {
    $scope.$apply();
    //console.log(Phased);
  });

  $scope.$watch('Phased.assignments', function(user){
    $scope.assignments = Phased.assignments;
    console.log('we are watching assingments', $scope.assignments);

  });
});
