var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to the database
mongoose.connect('mongodb://utkj97:test1@ds261078.mlab.com:61078/todo-list');

//Create a schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo',todoSchema);

//var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding ass'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

  app.get('/todo',function(req, res){
    //get data from mongodb and pass it to the view
    Todo.find({}, function(err, data){
      if(err) throw err;
      res.render('todo',{todos: data});
    });
  });

  app.post('/todo', urlencodedParser, function(req, res){
    //Get data from the view and add it to mongodb
    var newTodo = Todo(req.body).save(function(err, data){
      if(err) throw err;
      res.json(data)
    });
  });

  app.delete('/todo/:item',function(req, res){
    //Delete the requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g," ")}).remove(function(err, data){
      if(err) throw err;
      res.json(data);
    });

  /*  data = data.filter(function(todo){
      return todo.item.replace(/ /g,'-') !== req.params.item;
    });
    res.json(data);*/
  });

};
