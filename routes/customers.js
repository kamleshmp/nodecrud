
/*
 * GET users listing.
 */

var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://postgres:postgres@localhost:5432/my-db')

exports.list = function(req, res){

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
    res.render('customers',{page_title:"Customers - Node.js",data: data});
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })
  
};

exports.add = function(req, res){
  res.render('add_customer',{page_title:"Add Customers - Node.js"});
};

exports.edit = function(req, res){
    
    var id = req.params.id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM customer WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('edit_customer',{page_title:"Edit Customers - Node.js",data:rows});
                
           
         });
         
         //console.log(query.sql);
    }); 
};

/*Save the customer*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone 
        
        };
        
        var query = connection.query("INSERT INTO customer set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/customers');
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};

exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone 
        
        };
        
        connection.query("UPDATE customer set ? WHERE id = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/customers');
          
        });
    
    });
};


exports.delete_customer = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM customer  WHERE id = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/customers');
             
        });
        
     });
};


