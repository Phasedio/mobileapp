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

angular.module('App').controller('taskItemController', function ($scope, $state, $rootScope, $ionicPopup, $cordovaDatePicker, $firebaseArray, $localStorage, $location, $http, $ionicModal, $firebaseObject, Auth, FURL, Utils,Phased, $cordovaCamera, $stateParams) {

  var ref = new Firebase(FURL);

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

  $scope.currentUser = Phased.team.members[$scope.myID]
  console.log('the current user is ', $scope.currentUser)

  $scope.taskid = $stateParams.taskid
  $scope.task = $scope.tasks[$scope.taskid];

  $scope.tasks = $rootScope.tasks;

  console.log($scope.task, $scope.taskid);

  if($scope.task.deadline){
    console.log('we have one');
  }else {
    console.log('well we dont');
  }

  var myDate = new Date($scope.task.deadline);

  $scope.task.due = myDate.toDateString();

  $scope.openCamera = function () {
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
      ref.child('team').child(Phased.team.uid).child('projects').child('0A').child('columns').child('0A').child('cards').child('0A').child('tasks').child($scope.taskid).child('image').set($scope.task.image)
    })
  }

  if ($scope.task.priority == 2) {
    $scope.priority = "Low";

  } else if ($scope.task.priority == 1) {
    $scope.priority = "Medium";

  } else {
    $scope.priority = "High";
  }

  if ($scope.task.status == 0) {
    $scope.task.statusName = "In Progress";
    $scope.toggleState = false;
  } else if($scope.task.status == 2){
    $scope.task.statusName = "Assigned";
    $scope.toggleState = true;
  }
  //find the category
  $scope.task.categories = Phased.team.categoryObj;
  $scope.task.category = Phased.team.categoryObj[$scope.task.cat];
  console.log($scope.task.category);

  //Dealing with the toggling between start and stop
  $scope.toggleText = $scope.toggleState ? 'Start' : 'Stop';
  $scope.toggleClass = $scope.toggleState ? 'button-balanced' : 'button-dark';

  $scope.toggle = function (taskid, task) {
    $scope.toggleState = !$scope.toggleState;
    $scope.toggleText = $scope.toggleState ? 'Start' : 'Stop';

    console.log('we clicked toggle', $scope.toggleState);
    if ($scope.toggleState) {
      $scope.task.statusName = "Assigned";
      $scope.toggleClass = 'button-balanced';
      console.log('pausing the task', taskid, task);
      Phased.setTaskStatus(taskid, Phased.task.STATUS_ID.ASSIGNED)
    } else {
      console.log('we will run the Stat task', taskid, task);
      $scope.task.statusName = "In Progress";
      $scope.toggleClass = 'button-dark';
      Phased.setTaskStatus(taskid, Phased.task.STATUS_ID.IN_PROGRESS);
    }
  }

  //not being used yet//
  $scope.taskComments = function () {
    console.log('we will set up comments section');
  }

  $ionicModal.fromTemplateUrl('views/tasks/edit-task-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

  $scope.taskEdit = function(taskid, task) {
    $scope.modal.show();
    $scope.task = task;

    $scope.task.priority = {
      availableOptions: [
        {id: 2, name: 'Low'},
        {id: 1, name: 'Medium'},
        {id: 0, name: 'High'}
      ],
      selectedOption: {id: $scope.task.priority, name: $scope.priority} //This sets the default value of the select in the ui
    };

    $scope.task.status = {
      availableOptions: [
        {id: 2, name: 'Assigned'},
        {id: 0, name: 'In Progress'}
      ],
      selectedOption: {id: $scope.task.status, name: $scope.task.statusName} //This sets the default value of the select in the ui
    };

    if($scope.task.due == "Invalid Date"){
      console.log('we have an invalid date')
    }else{
      var date = myDate.toISOString();
      $scope.task.due = date.substr(0,date.indexOf('T'));

      $scope.task = {
        value: new Date($scope.task.due)
      };
    }
  };

  //sets up for reassigning members
  $scope.task.members = rtnTeamArry();
  var id = Phased.user.uid;
  $scope.task.members.selectedOption = {uid: id, name: Phased.team.members[id].name}

  $scope.saveEdit = function(task) {
    console.log('we will save the changes', task, Phased.user, Auth.user);
    if (task.members.selectedOption.uid == Phased.user.uid){
      console.log(task.members.selectedOption);
      //$scope.task.assigned_by = $scope.task.assigned_by;
    }else {
      $scope.task.assigned_by = Phased.user.uid;
      $scope.task.assigned_to = task.members.selectedOption.uid;
      //Phased.setTaskAssignee($scope.taskid, editedTask.members.selectedOption.uid);
      console.log('there is a changee')
    }

    console.log('the task category is ', task.categories.selectedOption);
    if (task.categories.selectedOption != null) {
      Phased.setTaskCategory($scope.taskid, task.categories.selectedOption.key);
      $scope.task.category = Phased.team.categoryObj[task.categories.selectedOption.key]
      console.log('we have a category');
    } else {
      console.log('categories are empty');
    }


    $scope.newTask = {
      assigned_by: $scope.task.assigned_by,
      assigned_to: $scope.task.assigned_to,
      name: task.name,
      description: task.description,
      status: task.status.selectedOption.id,
      priority: task.priority.selectedOption.id,
      due: task.value || "Invalid Date"
    }

    Phased.setTaskDesc($scope.taskid, task.description);
    Phased.setTaskName($scope.taskid, task.name);

    //$scope.task.due = task.value.toDateString();
    //Phased.setTaskDeadline($scope.taskid, task.value );

    $scope.priority = task.priority.selectedOption.name;
    $scope.task.priority = task.priority.selectedOption.id;
    console.log($scope.task.priority);
    Phased.setTaskPriority($scope.taskid, $scope.task.priority);

    //if there is a change to the status we will toggle the wording/button.
    if (task.status.selectedOption.name != $scope.task.statusName) {
      $scope.toggle($scope.taskid, $scope.newTask);
    }
    $scope.task.status = task.status.selectedOption.id;
    $scope.closeModal();
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.taskFinish = function(taskid, task){
    console.log('we will complete task', taskid, task);
    Phased.setTaskStatus(taskid, Phased.task.STATUS_ID.COMPLETE)
  }

  $scope.$on('modal.hidden', function() {
  });

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

  function rtnTeamArry(){
    var key = Object.keys(Phased.team.members);
    var arr = [];
    for (var i = 0; i < key.length; i++) {
      arr.push(Phased.team.members[key[i]]);
    }
    return arr;
  }
});
