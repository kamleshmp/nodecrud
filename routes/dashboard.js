
/*
 * GET users listing.
 */

var pgp = require('pg-promise')(/*options*/);
var async = require('async');

var config = {
  POSTGRES_USER_NAME: 'postgres', // your postgres username
  POSTGRES_PASSWORD: 'postgres', // your postgres upassword,
  DATABASE_NAME: 'my-db' // your database name
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
  var ta = req.body.tables;
  var tables = Object.keys(ta);
  // if(keys.length == 1) {
  //   var singleTable = keys[0];
  //   var rows = tables[singleTable];
  //   // var fetch = rows.length ? rows.join(', ') : '*';
  //   if(rows.length) {
  //     query = "SELECT "+ rows.join(', ') + " FROM " + singleTable;
  //   }
  // } else {
  //   var singleTable = keys[0];
  //   for (var i = 0; i < keys.length; i++) {
  //     if (query == "") {

  //       var arr = keys.map(function(e) {return e+'.*'}).join(', ');
  //       for (var j = 0; j < keys.length; j++) {
  //         if (tables[keys[j]].length) {
  //           fields += tables[keys[j]].join(', ')
  //           if(j < keys.length - 1) {
  //             fields+= ', '
  //           }
  //         } 

  //         // else {
  //         //   fields += keys[j]+'.*'
  //         //   if(j < keys.length - 1) {
  //         //     fields+= ', '
  //         //   }
  //         // }
  //       }
        
  //       query += 'SELECT  ' + fields + ' FROM '+ singleTable
  //       // query += " INNER JOIN "+ singleTable + " ON " + singleTable + ".slider_id="+ keys[i] + ".slider_id"
  //     } else {
  //       // query += "INNER JOIN "+keys[i]+ " ON " + singleTable+'.site_code' = keys[i]+".site_code"
  //       query += " FULL OUTER JOIN "+ keys[i] + " ON " + keys[i] + ".slider_id="+ singleTable + ".slider_id"
  //     }
  //   }

  // }

  
 
	// for (var i = 0; i < tables.length; i++) {
	// 	  if(params[tables[i]].length) {
	// 	   for (var j = 0; j < params[tables[i]].length; j++) {
	// 	     query+= tables[i]+ "." + params[tables[i]][j] + " AS " + tables[i]+ "_" + params[tables[i]][j]  
	// 	     if(j < params[tables[i]].length) {
	// 	        query+= ', '
	// 	     }
	//    	}
	//   }
	// }

// var ta = req.body.tables;
// var tables = Object.keys(ta);
q = ""
// for (var i = 0; i < tables.length; i++) {
//   if(ta[tables[i]].length) {
//    for (var j = 0; j < ta[tables[i]].length; j++) {
//      q+= tables[i]+ "." + ta[tables[i]][j] + " AS " + tables[i]+ "_" + ta[tables[i]][j]  
//      if(j < ta[tables[i]].length) {
//         q+= ', '
//      }
//    }
//   }
// }
var finalData= []
console.log('ta', ta)
 console.log('dafasdf', tables)
async.forEach(tables, function(table, callback) {
	q = "";
	async.forEach(ta[table], function(col, callback1) {
		var column = col;
		q+= col + " AS " + column.replace('.','_')  
    q+= ', '
		callback1();     
	}, function(err) {
		q = q.replace(/,\s*$/, "");
	  q = "SELECT "+q + " FROM "+ table;
	  db.query(q)
		  .then(function (data) {
		  	console.log('data', data)
		  	console.log('query', q)
		    finalData = finalData.concat(data);
		    q = "";
		    callback()
		  })
		  .catch(function (error) {
		    console.log('ERROR:', error)
		    callback()
		 })
	})

}, function(err) {
	console.log('xxxxxxxxxxxx', finalData)
	res.json({data: finalData})
	// q = q.replace(/,\s*$/, "");
 //  q = "SELECT "+q;
 //  db.query(q)
	//   .then(function (data) {
	//     res.json({data: data});
	//   })
	//   .catch(function (error) {
	//     console.log('ERROR:', error)
	//   })
})


 
 
 	
  // setTimeout(function() {
	 //  db.query(query)
	 //  .then(function (data) {
	 //    res.json({data: data});
	 //  })
	 //  .catch(function (error) {
	 //    console.log('ERROR:', error)
	 //  })
  // },1000);
};


