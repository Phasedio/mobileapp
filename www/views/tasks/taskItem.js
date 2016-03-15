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

angular.module('App').controller('taskItemController', function ($scope, $state, $rootScope, $ionicPopup, $cordovaDatePicker, $localStorage, $location, $http, $ionicModal, $firebaseObject, Auth, FURL, Utils,Phased, $cordovaCamera, $stateParams) {
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

  $scope.openCamera = function () {
    alert('we are going to open camera');

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

    $cordovaCamera.getPicture(options).then(function (photo) {
      $scope.task.image = "data:image/jpeg;base64," + photo;
      //savePhoto($scope.task.image);
      //$firebaseObject
      //right away save?
    })

    //function savePhoto(image){
    //  alert('we are going to save the photo to the database');
    //}
  }

  //$("#priorityDropdown").val($scope.task.priority);


  if ($scope.task.priority == 2) {
    $scope.priority = "Low";

  } else if ($scope.task.priority == 1) {
    $scope.priority = "Medium";

  } else {
    $scope.priority = "High";
  }

  $scope.task.priority = {
    availableOptions: [
      {id: '2', name: 'Low'},
      {id: '1', name: 'Medium'},
      {id: '0', name: 'High'}
    ],
    selectedOption: {id: $scope.task.priority, name: $scope.priority} //This sets the default value of the select in the ui
  };


  if ($scope.task.status == 0) {
    $scope.status = "In Progress";
    $scope.toggleState = false;
  } else {
    $scope.status = "Assigned";
    $scope.toggleState = true;
  }

  //Dealing with the toggling between start and stop

  $scope.toggleText = $scope.toggleState ? 'Start' : 'Stop';
  $scope.toggleClass = $scope.toggleState ? 'button-balanced' : 'button-dark';

  $scope.toggle = function (taskid, task) {
    $scope.toggleState = !$scope.toggleState;
    $scope.toggleText = $scope.toggleState ? 'Start' : 'Stop';

    console.log('we clicked toggle', $scope.toggleState);
    if ($scope.toggleState) {
      $scope.status = "Assigned";
      $scope.toggleClass = 'button-balanced';
      console.log('pausing the task', taskid, task);
      Phased.setTaskStatus(taskid, Phased.task.STATUS_ID.ASSIGNED)
    } else {
      console.log('we will run the Stat task', taskid, task);
      $scope.status = "In Progress";
      $scope.toggleClass = 'button-dark';
      Phased.activateTask(taskid, task);
    }
  }

  $scope.taskComments = function () {
    console.log('we will set up comments section');
  }


  $ionicModal.fromTemplateUrl('views/tasks/edit-task-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

  $scope.taskEdit = function(task) {
    console.log('we will set up edit section, I think we can just open up a new modal');
    $scope.modal.show(task);

    if($scope.task.due == "Invalid Date"){
      console.log('we have an invalid date')
    }else{
      var date = myDate.toISOString();
      $scope.task.due = date.substr(0,date.indexOf('T'));

      $scope.task = {
        value: new Date($scope.task.due)
      };
    }


    //$scope.status.name.focus();
  };

  $scope.saveEdit = function(editedTask) {
    console.log('we will save the changes', editedTask);
  }

  $scope.closeEditTask = function() {
    console.log('will close the edit task');
    $scope.modal.hide();
  };

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
