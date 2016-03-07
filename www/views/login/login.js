'Use Strict';
angular.module('App').controller('loginController', function ($scope, $state, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils,Phased) {
  console.log(Phased);
  var ref = new Firebase(FURL);
  var userkey = "";
  $scope.signIn = function (user) {
    console.log("Enviado");
    if(angular.isDefined(user)){
    Utils.show();
    Auth.login(user)
      .then(function(authData) {
        angular.copy(authData, Auth.user);
        Utils.hide();
        $state.go('menu.tab.home');
      //console.log("id del usuario:" + JSON.stringify(authData));

      // ref.child('profile').orderByKey().equalTo(authData.uid).on("child_added", function(snapshot) {
      //   console.log(snapshot.key());
      //   userkey = snapshot.key();
      //   var obj = $firebaseObject(ref.child('profile').child(userkey));
      //
      //   obj.$loaded()
      //     .then(function(data) {
      //       //Phased.init(Auth);
      //       //console.log(data === obj); // true
      //       //console.log(obj.email);
      //       //$localStorage.email = obj.email;
      //       //$localStorage.userkey = userkey;
      //
      //
      //         $state.go('home');
      //         console.log("Starter page","Home");
      //
      //     })
      //     .catch(function(error) {
      //       console.error("Error:", error);
      //     });
      // });

      }, function(err) {
        Utils.hide();
         Utils.errMessage(err);
      });
    }
  };

});
