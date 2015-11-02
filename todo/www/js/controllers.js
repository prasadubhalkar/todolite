var todoCtrls = angular.module('starter.controllers', []);

todoCtrls.controller('DashCtrl', function($scope,$ionicPopup,RemoteServerFactory,LocalServerFactory) {
  $scope.init = function(){
    $scope.goal = { name: "" , done : 0 };
    console.log(RemoteServerFactory.getCounts())
    $scope.incompletedCnt = RemoteServerFactory.getCounts().inCompleteCnt;
    $scope.completedCnt   = RemoteServerFactory.getCounts().completeCnt;
  }

  $scope.addGoalRemote = function(idLite) { 
    RemoteServerFactory.addServerData(idLite,$scope.goal.name,$scope.goal.done).then(function(result){
      $scope.showAlert('Added','New Goal Added');
    },function(error){
      $scope.showAlert('Something went wrong','New Goal Insertion Failed'); 
    });
  }

  $scope.addGoal = function() { 
    if($scope.goal.name != "") { 
      LocalServerFactory.add($scope.goal.name,$scope.goal.done).then(function(result){
        $scope.addGoalRemote(result.insertId);
      },function(error){
        $scope.showAlert('Something went wrong','New Goal Insertion Failed');   
      });
    } else {
      $scope.showAlert('Error','Need to have a goal name'); 
    }
  }

  $scope.showAlert = function(title,message) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: message
    });
    alertPopup.then(function(res) {
      $scope.goal = { name: "" , done : 0 }
    });  
  }

  $scope.init();
});

todoCtrls.controller('GoalsCtrl', function($scope,$ionicPopup,$window,RemoteServerFactory,LocalServerFactory) {
  $scope.completeCount = 0;
  $scope.incompleteCount = 0;

  $scope.showAlert = function(title,message){
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: message
    });
    alertPopup.then(function(res) {
      $scope.getAllGoals(); 
    });
  }

  $scope.getAllGoals = function() {
    RemoteServerFactory.getServerData().then(function(response) {
        $scope.goals = [];
        for(var i = 0; i < response.data.length; i++){
          $scope.goals.push({
            "_id" : response.data[i]._id,
            "id" : response.data[i].id,
            "name" : response.data[i].name,
            "completed" : parseInt(response.data[i].completed)
          });
          if(parseInt(response.data[i].completed) == 1){
            $scope.completeCount += 1;
          } else {
            $scope.incompleteCount += 1;
          }
        }
        RemoteServerFactory.setCounts($scope.completeCount,$scope.incompleteCount);

    }, function(response) {
        $scope.showAlert("Failed","Get Error : " + response.status)
        return response.data;
    });
  }

  $scope.updateGoal = function(goal) {
    RemoteServerFactory.updateServerData(goal).then(function(){
      $scope.showAlert("Updated","Goal Updated");
    });
  }

  $scope.removeGoal = function(goal) {
    RemoteServerFactory.removeServerData(goal._id).then(function(){
      $scope.showAlert("Removed","Goal Removed");
    });
  }

  $scope.getAllGoalsLite = function(){
    LocalServerFactory.all().then(function(goals){
      $scope.goals = goals;
    });
  }
  
  $scope.updateGoalLite = function(goal){
    LocalServerFactory.update(goal.id,goal).then(function(){
      $scope.showAlert("Updated","Goal updated");
    });  
  }

  $scope.removeGoalLite = function(goal){
    LocalServerFactory.remove(goal._id).then(function(){
      $scope.showAlert("Removed","Goal removed");
    });  
  }
  
  $scope.getAllGoals();
});

todoCtrls.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableComplete: true
  };
});
