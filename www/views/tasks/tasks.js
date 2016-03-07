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
angular.module('App').controller('TasksController', function ($scope, $rootScope, $state, $localStorage, $location,$http,$ionicPopup,$ionicModal, $firebaseObject, Auth, FURL, Utils,Phased) {
  var ref = new Firebase(FURL);
  $scope.team = Phased.team;
  console.log('the team', $scope.team);
  $scope.currentUser = Phased.user;
  console.log('the current user is ', $scope.currentUser);
  $scope.assignments = Phased.assignments;

  $scope.activeStream = Phased.assignments.to_me;
  console.log('the phased active', $scope.activeStream);

  $scope.activeStreamName = 'assignments.to_me';
  $scope.activeStatusFilter = '!1'; // not completed tasks
  // $scope.filterView = $scope.activeStreamName;//for the select filter
   $scope.taskPriorities = Phased.TASK_PRIORITIES; // in new task modal
  $scope.taskStatuses = Phased.TASK_STATUSES; // in new task modal
  $scope.taskPriorityID = Phased.TASK_PRIORITY_ID;
  $scope.taskStatusID = Phased.TASK_STATUS_ID;
  $scope.myID = Auth.user.uid;

    console.log('the priorities are', $scope.taskPriorities);
  $scope.projects = Phased.team.projects;
  console.log($scope.projects);

  angular.forEach($scope.projects, function(value, key){
    console.log(value, key);
    $scope.columns = value.columns;

    angular.forEach($scope.columns, function(value, key) {
      console.log(value);
      $scope.cards = value.cards;

      angular.forEach($scope.cards, function(value, key) {
        console.log(value);
        $scope.tasks = value.tasks;
        console.log($scope.tasks);
        $rootScope.tasks = $scope.tasks;
      })
    })
  })

  $scope.bgColor = function(task){
    if(task.status == 1) {
      $scope.status = "Complete";
      return "#CC0000";
    } else if(task.status == 0){
      $scope.status = "In Progress";
      return "#55c73b";
    } else {
      $scope.status = "Assigned";
      return "#CC0000";
    }

    //}

  }

  //if ($scope.task.priority==2){
  //  $scope.priority = "Low";
  //} else if ($scope.task.priority==1){
  //  $scope.priority = "Medium";
  //} else {
  //  $scope.priority = "High";
  //}


  for(var taskId in $scope.activeStream){

    console.log("User Id: " + taskId, $scope.activeStream);
    //$scope.taskId = taskId;
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
  jQuery('.ion-ios-star').addClass('active');

  $scope.showTaskList = function(){
    jQuery('.ion-ios-star').addClass('active');

    jQuery('.ion-android-checkbox-outline').removeClass('active');


    $scope.showTaskListView = true;
    $scope.showCompletedTasksView = false;
  };
  $scope.showComplete = function(){
    console.log('the tasks that are complted');
    jQuery('.ion-android-checkbox-outline').addClass('active');
    jQuery('.ion-ios-star').removeClass('active');

    $scope.showTaskListView = false;
    $scope.showCompletedTasksView = true;
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
