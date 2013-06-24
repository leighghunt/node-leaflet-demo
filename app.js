/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , ShapeProvider = require('./shapeprovider').ShapeProvider;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var shapeProvider= new ShapeProvider('localhost', 27017);

//Routes

app.get('/', function(req, res){
  shapeProvider.findAll(function(error, emps){
      res.render('index', {
            title: 'Shapes',
            shapes:emps
        });
  });
});

app.get('/shape/new', function(req, res) {
    res.render('shape_new', {
        title: 'New Shape'
    });
});

//save new shape
app.post('/shape/new', function(req, res){
    shapeProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.listen(3000);