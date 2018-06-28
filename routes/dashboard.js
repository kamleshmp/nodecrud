
/*
 * GET users listing.
 */

var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://postgres:postgres@localhost:5432/my-db')

exports.tables = function(req, res){

  // req.getConnection(function(err,connection){
       
  //       var query = connection.query('SELECT * FROM customer',function(err,rows)
  //       {
            
  //           if(err)
  //               console.log("Error Selecting : %s ",err );
     
  //           res.render('customers',{page_title:"Customers - Node.js",data:rows});
                
           
  //        });
         
  //        //console.log(query.sql);
  //   });

  db.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
   // db.query('SELECT * FROM customers')
  .then(function (data) {
    console.log('DATA:', data)
    res.json({data: data});

    // res.render('dashboard',{page_title:"Customers - Node.js",data: data});
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })
  
};

exports.tableDetails = function(req, res) {

  // req.getConnection(function(err,connection){
       
  //       var query = connection.query('SELECT * FROM customer',function(err,rows)
  //       {
            
  //           if(err)
  //               console.log("Error Selecting : %s ",err );
     
  //           res.render('customers',{page_title:"Customers - Node.js",data:rows});
                
           
  //        });
         
  //        //console.log(query.sql);
  //   });

  console.log('req', req.body)
  db.query("SELECT * from " + req.body.table)
   // db.query('SELECT * FROM customers')
  .then(function (data) {
    console.log('DATA:', data)
    res.json({data: data});

    // res.render('dashboard',{page_title:"Customers - Node.js",data: data});
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })
}
exports.tableColumns = function(req, res) {
    db.query("select column_name from information_schema.columns where table_name='" + req.body.table + "'")
        // db.query('SELECT * FROM customers')
        .then(function(data) {
            res.json({ data: data });
            // res.render('dashboard',{page_title:"Customers - Node.js",data: data});
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
  console.log('query', query);
  db.query(query)
   // db.query('SELECT * FROM customers')
  .then(function (data) {
    // console.log('DATAdddddddd', data)
    res.json({data: data});
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })



// SELECT tasks.t_name, tasks.slider_id , services.name from tasks 

// INNER JOIN services ON services.slider_id = tasks.slider_id 

// INNER JOIN products ON products.slider_id = tasks.slider_id 

// INNER JOIN news ON news.slider_id = tasks.slider_id



  
};


