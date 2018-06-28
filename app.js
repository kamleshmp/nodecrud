
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)

//load customers route
var dashboard = require('./routes/dashboard'); 

var app = express();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
// app.use(bodyParser.urlencoded({'extended':'true'}));
            // parse application/x-www-form-urlencoded
app.use(bodyParser.json({ type: 'application/json' })); // parse application/vnd.api+json as json
app.use(express.bodyParser());
app.use(bodyParser.json());  
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/api/all_tables',dashboard.tables);
app.post('/api/table_details', dashboard.tableDetails);
app.post('/api/table_columns', dashboard.tableColumns);
app.post('/api/download_tables', dashboard.downloadTables);

app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
