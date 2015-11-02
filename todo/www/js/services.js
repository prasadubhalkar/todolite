var todoFactory = angular.module('starter.services', ['ngCordova']);
var endpoint = "http://192.168.0.4:3001/";
todoFactory.factory('_db', function($cordovaSQLite,$q,$ionicPlatform) {
  var self = this;

  self.query = function(query,parameters) {
    parameters = parameters || [];
    var q = $q.defer();

    $ionicPlatform.ready(function(){
      $cordovaSQLite.execute(db,query,parameters).then(
        function(result){
          q.resolve(result);
        },function(error){
          console.warn("SQL Query Error");
          console.log(error);
          q.reject(error);
        }
      )
    });

    return q.promise;
  }

  self.getAll = function(result){
    var output = [];
    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));
    }
    return output;
  }

  self.getById = function(result){
    var output = null;
    output = angular.copy(result.rows.item(0));
    return output;
  }

  return self;
});

todoFactory.factory("RemoteServerFactory",function($cordovaSQLite,_db,$http) {
  var self = this;

  //MongoDB get all records
  self.getServerData = function() {
    return $http({method: 'GET', url: endpoint});
  }

  self.setCounts = function(completeCnt, inCompleteCnt){
    self.completeCnt = completeCnt;
    self.inCompleteCnt =  inCompleteCnt;
  }

  self.getCounts = function() {
    return {
      "completeCnt" : self.completeCnt,
      "inCompleteCnt" : self.inCompleteCnt
    };
  }

  //MongoDB add new record 
  self.addServerData = function(id,name,completed) {
    return $http({
      method: "GET",
      url: endpoint+'add',
      params: {
        id: id,
        goalname: name,
        goalcompleted: completed
      }
    });
  }

  //MongoDB remove existing record
  self.removeServerData = function(_id) {
    return $http({
      method: "GET",
      url: endpoint+'remove',
      params: {
        _id: _id
      }
    });
  }

  //MongoDB update existing record
  self.updateServerData = function(goal) {
    return $http({
      method: "GET",
      url: endpoint+'update',
      params: {
        _id: goal._id,
        id : goal.id,
        name: goal.name,
        completed:goal.completed
      }
    });  
  }
  return self;
});

todoFactory.factory("LocalServerFactory",function($cordovaSQLite,_db) {
  var self = this;
  //SQLlite get all records
  self.all = function() {
    return _db.query("SELECT id,name,completed FROM goals")
      .then(function(result){
        return _db.getAll(result);
      });
  }

  //SQLlite get specific record
  self.get = function(id) {
    var parameters = [id];
    return _db.query("SELECT name, completed FROM goals WHERE id = (?)", parameters)
      .then(function(result) {
        return _db.getById(result);
      });
  }

  //SQLlite add new record
  self.add = function(name,completed) {
    var parameters = [name, completed];
    return _db.query("INSERT INTO goals (name, completed) VALUES (?,?)", parameters);
  }

  //SQLlite remove existing record
  self.remove = function(id) {
    var parameters = [id];
    return _db.query("DELETE FROM goals WHERE id = (?)", parameters);
  }

  //SQLlite update existing record
  self.update = function(id, editMember) {
    var parameters = [editMember.completed, editMember.name, id];
    return _db.query("UPDATE goals SET completed = (?), name = (?) WHERE id = (?)", parameters);
  }

  return self;
});
