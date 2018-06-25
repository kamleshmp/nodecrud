
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

exports.tableDetails = function(req, res){

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
  
};
