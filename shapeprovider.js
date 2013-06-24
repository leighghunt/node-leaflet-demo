var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ShapeProvider = function(host, port) {
  this.db= new Db('node-mongo-shape', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


ShapeProvider.prototype.getCollection= function(callback) {
  this.db.collection('shapes', function(error, shape_collection) {
    if( error ) callback(error);
    else callback(null, shape_collection);
  });
};

//find all shapes
ShapeProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, shape_collection) {
      if( error ) callback(error)
      else {
        shape_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new shape
ShapeProvider.prototype.save = function(shapes, callback) {
    this.getCollection(function(error, shape_collection) {
      if( error ) callback(error)
      else {
        if( typeof(shapes.length)=="undefined")
          shapes = [shapes];

        for( var i =0;i< shapes.length;i++ ) {
          shape = shapes[i];
          shape.created_at = new Date();
        }

        shape_collection.insert(shapes, function() {
          callback(null, shapes);
        });
      }
    });
};

exports.ShapeProvider = ShapeProvider;