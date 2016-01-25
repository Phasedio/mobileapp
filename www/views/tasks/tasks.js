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
angular.module('App').controller('TasksController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup,$ionicModal, $firebaseObject, Auth, FURL, Utils,Phased) {
  var ref = new Firebase(FURL);
  $scope.team = Phased.team;
  console.log('the team', $scope.team)
  $scope.currentUser = Phased.user.profile;
  $scope.assignments = Phased.assignments;

  //$scope.archive = Phased.archive;

  $scope.activeStream = Phased.assignments.to_me;
  console.log($scope.activeStream);

  $scope.activeStreamName = 'assignments.to_me';
  $scope.activeStatusFilter = '!1'; // not completed tasks
  // $scope.filterView = $scope.activeStreamName;//for the select filter
   $scope.taskPriorities = Phased.TASK_PRIORITIES; // in new task modal
  $scope.taskStatuses = Phased.TASK_STATUSES; // in new task modal
  $scope.taskPriorityID = Phased.TASK_PRIORITY_ID;
  $scope.taskStatusID = Phased.TASK_STATUS_ID;
  $scope.myID = Auth.user.uid;

  for(var taskId in $scope.activeStream){
    console.log("User Id: " + taskId);
    //$scope.taskId = taskId;
  }

  $scope.$on('Phased:membersComplete', function() {
    $scope.$apply();
  });

  // history retrieved
  $scope.$on('Phased:historyComplete', function() {
    $scope.$apply();
    console.log(Phased);
  });

    $scope.$watch('Phased.assignments', function(user){
      $scope.assignments = Phased.assignments;
    });

  //Add modal fucntions
  $ionicModal.fromTemplateUrl('my-task.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.taskAdd = function() {
    console.log('will open up a modal to add a new task');
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

  $scope.showTaskListView = true;
  jQuery('.ion-checkmark.taskList').addClass('active');

  $scope.showTaskList = function(){
    $scope.showTaskListView = true;
    $scope.showChatView = false;
    $scope.showProjectView = false;
  };
  $scope.showChat = function(){
    jQuery('.ion-checkmark.taskList').removeClass('active');
    $scope.showTaskListView = false;
    $scope.showChatView = true;
    $scope.showProjectView = false;
  };
  $scope.showProject = function(){
    jQuery('.ion-checkmark.taskList').removeClass('active');
    $scope.showTaskListView = false;
    $scope.showChatView = false;
    $scope.showProjectView = true;
  };

  $scope.taskView = function(taskID){
    $scope.task = Phased.assignments.all[taskID];
    $scope.openModal();
  }

  $scope.taskCompleted = function(id){
    console.log('will check task off list then remove it', id);
  }

  //$scope.taskDetail = function(id){
  //  console.log('will go to details for each task', id);
  //  $scope.go('tab.{{id}}');
  //};


  $scope.startTask = function(task) {
      if (!task.user || task.unassigned)
        Phased.takeTask(task.key);
      Phased.activateTask(task.key);

    }

    $scope.moveToArchive = function(assignmentID) {
      Phased.moveToFromArchive(assignmentID);
      $scope.closeDetails();

    }

    $scope.moveFromArchive = function(assignmentID) {
      Phased.moveToFromArchive(assignmentID, true);

    }

    // gets archived tasks at address shows archive
    $scope.getArchiveFor = function(address) {
      Phased.getArchiveFor(address);

    }

    $scope.setTaskCompleted = function(assignmentID) {
      Phased.setAssignmentStatus(assignmentID, Phased.TASK_STATUS_ID.COMPLETE);

    }

    //Broadcasts that user is working on Task
    $scope.broadcastTask = function(task){
      Phased.activateTask(task.key);

       //toaster.pop('success', "Success!", "Your task was posted");
    }

});
