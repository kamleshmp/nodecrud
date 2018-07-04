
/*
 * GET users listing.
 */

var pgp = require('pg-promise')(/*options*/);

var config = {
  POSTGRES_USER_NAME: 'postgres', // your postgres username
  POSTGRES_PASSWORD: 'postgres', // your postgres upassword
  DATABASE_NAME: 'mydb'
}


var db = pgp('postgres://'+config.POSTGRES_USER_NAME+':'+config.POSTGRES_PASSWORD+'@localhost:5432/'+config.DATABASE_NAME)

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
  var singleTable = keys[0];
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
    var fromDate = new Date(req.body.fromDate);
    var frommonth = fromDate.getUTCMonth() + 1; //months from 1-12
    var fromday = fromDate.getUTCDate();
    var fromyear = fromDate.getUTCFullYear();
    var newFromDate = fromyear + "-" + frommonth + "-" + fromday+ " 00:00:00.000"


    var toDate = new Date(req.body.toDate);
    var tomonth = toDate.getUTCMonth() + 1; //months from 1-12
    var today = toDate.getUTCDate();
    var toyear = toDate.getUTCFullYear();
    var newToDate = toyear + "-" + tomonth + "-" + today

    //query += " WHERE "+singleTable+".from_date >= '2012-03-08 00:00:00.000'"+ " AND "+singleTable+".to_date <= '2019-03-08 01:00:00.000'" 
     
     if(req.body.fromDate && req.body.toDate) {
       query += " WHERE "+singleTable+".from_date >="+ "'"+req.body.fromDate+"'" + " AND "+singleTable+".to_date <= "+"'"+req.body.toDate+"'"
     } else if (req.body.fromDate) {
       query += " WHERE "+singleTable+".from_date >="+ "'"+req.body.fromDate+"'"
     } else if (req.body.toDate) {
       query += " WHERE "+singleTable+".to_date <="+ "'"+req.body.toDate+"'"
     }
    
    if(req.body.sliderId && !req.body.fromDate && !req.body.toDate) {
      query+= " WHERE " + singleTable+ ".slider_id="+"'"+req.body.sliderId+"'" 
    }

    if(req.body.sliderId && (req.body.fromDate || req.body.toDate)) {
      query+= " AND " + singleTable+ ".slider_id="+"'"+req.body.sliderId+"'" 
    }

    console.log('query',query)
    console.log('sliderId', req.body)
    query += " LIMIT "+ req.body.limit
    if(req.body.queryType == 'sqlString') {
      res.json({sqlString: query, data: []});
    } else {
  	  db.query(query)
  	  .then(function (data) {
  	    res.json({data: data});
  	  })
  	  .catch(function (error) {
  	    console.log('ERROR:', error)
  	  })
    }
  },1000);
};


