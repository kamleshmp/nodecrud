
/*
 * GET users listing.
 */

var pgp = require('pg-promise')(/*options*/);

var config = {
  POSTGRES_USER_NAME: '', // your postgres username
  POSTGRES_PASSWORD: '' // your postgres upassword
}


var db = pgp('postgres://'+config.POSTGRES_USER_NAME+':'+config.POSTGRES_PASSWORD+'@localhost:5432/my-db')

exports.tables = function(req, res){
  db.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
  .then(function (data) {
    res.json({data: data});
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })
  
};

exports.tableDetails = function(req, res) {
  db.query("SELECT * from " + req.body.table)
  .then(function (data) {
    res.json({data: data});
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })
}
exports.tableColumns = function(req, res) {
    db.query("select column_name from information_schema.columns where table_name='" + req.body.table + "'")
        .then(function(data) {
            res.json({ data: data });
        })
        .catch(function(error) {
            console.log('ERROR:', error)
        })
};

exports.downloadTables = function(req, res) {
  var query = "";
  var fields = "";
  var tables = req.body.tables;
  var keys = Object.keys(tables);
  if(keys.length == 1) {
    var singleTable = keys[0];
    var rows = tables[singleTable];
    // var fetch = rows.length ? rows.join(', ') : '*';
    if(rows.length) {
      query = "SELECT "+ rows.join(', ') + " FROM " + singleTable;
    }
  } else {
    var singleTable = keys[0];
    for (var i = 0; i < keys.length; i++) {
      if (query == "") {

        var arr = keys.map(function(e) {return e+'.*'}).join(', ');
        for (var j = 0; j < keys.length; j++) {
          if (tables[keys[j]].length) {
            fields += tables[keys[j]].join(', ')
            if(j < keys.length - 1) {
              fields+= ', '
            }
          } 

          // else {
          //   fields += keys[j]+'.*'
          //   if(j < keys.length - 1) {
          //     fields+= ', '
          //   }
          // }
        }
        
        query += 'SELECT  ' + fields + ' FROM '+ singleTable
        // query += " INNER JOIN "+ singleTable + " ON " + singleTable + ".slider_id="+ keys[i] + ".slider_id"
      } else {
        // query += "INNER JOIN "+keys[i]+ " ON " + singleTable+'.site_code' = keys[i]+".site_code"
        query += " FULL OUTER JOIN "+ keys[i] + " ON " + keys[i] + ".slider_id="+ singleTable + ".slider_id"
      }
    }

  }
  setTimeout(function() {
	  db.query(query)
	  .then(function (data) {
	    res.json({data: data});
	  })
	  .catch(function (error) {
	    console.log('ERROR:', error)
	  })
  },1000);
};


