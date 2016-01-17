'Use Strict';
angular.module('App').controller('ProfileController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup,$ionicModal, $firebaseObject, Auth, FURL, Utils,Phased) {

  // PhasedProvider integrations
  // n.b.: categories now in Phased.team.categorySelect and in Phased.team.categoryObj (different structures)
  // n.b.: Phased.user.profile is a link to Phased.team.members[Auth.user.uid].profile;
  $scope.team = Phased.team;
  $scope.currentUser = Phased.user.profile;
  $scope.assignments = Phased.assignments;
  //$scope.archive = Phased.archive;
  console.log($scope.team);

  // ensure view updates when new members are added
  // members data retrieved
  $scope.$on('Phased:membersComplete', function() {
    $scope.$apply();
  });

  // history retrieved
  $scope.$on('Phased:historyComplete', function() {
    $scope.$apply();
    console.log(Phased);
  });

  // Update Account
    $scope.updateUser = function(update){
      var toaster = { pop : function(a) { console.log(a) } }; // patch while the toaster disappeared!
      if (update.email === undefined || update.email === '') {
        update.email = $scope.currentUser.email;
      }
      if (update.tel !== $scope.currentUser.tel) {
        console.log('hit the tel!');
        if (Auth.changeTel(update, Auth.user.uid)) {
          toaster.pop('success', "Your phone number has been updated");
          $scope.currentUser.tel = update.tel;
        } else {
          toaster.pop('error', 'Invalid phone number');
        }
      }

      if (update.name === $scope.currentUser.name || update.name === undefined || update.name === ''){
        //console.log("we are changing the password");
        if(update.oldPass && update.newPass){
          console.log('we will change the password');
          Auth.changePassword(update).then(function (){
            console.log('will change password');
            toaster.pop('success', "Your password has been changed!");
          }, function(err) {
            console.log('error', err);
            if (err == "Error: The specified password is incorrect.") {
              console.log("we are here");
              toaster.pop('error', 'Your current password is incorrect');
            } else {
              toaster.pop('error', 'Your email is incorrect! Make sure you are using your current email');
            }
          });
        } else {
          console.log('changing email');
          console.log(update.email);
          if (update.email !== $scope.currentUser.email) {
            console.log('we are changing the email', Auth.user.uid);
            Auth.changeEmail(update, Auth.user.uid);
            toaster.pop('success', "Your email has been updated!");
            $scope.currentUser.email = update.email;
          }
        }
      } else {
        console.log('changing userName or email');
        console.log(update.email);
        if (update.name !== $scope.currentUser.name) {
          Auth.changeName(update, Auth.user.uid);

          new Firebase(FURL).child('profile').child(Auth.user.uid).once('value', function(user) {
            user = user.val();

            console.log(user);
            console.log(Auth.user.uid);
          });

          toaster.pop('success', "Your name has been updated!");
        }

        if (update.email !== $scope.currentUser.email) {
          Auth.changeEmail(update, Auth.user.uid);
          toaster.pop('success', "Your email has been updated!");
        }
      }
    };
    $scope.tab = function(place){
      $state.go(place);
    }

});
