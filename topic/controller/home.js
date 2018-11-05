module.exports = function (request, response, controllerName) {
    this.request  = request;
    this.response = response;
    this.viewPath = controllerName + "/";
    
    //引用資料庫
    var mysql = require("mysql");
    var connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password:"",
        database:"topicDb"
    });
    
    connection.connect(function(err){
        if(err) {
        console.log("cannot connect");
        }
    });
    
    //以 nodemailer 模組協助表單轉寄信箱
    var nodeMailer = require('nodemailer');
    
	this.index = function () {
	  
	   connection.query('select * from goods',
	   "",
	   function (err, rows) {
	      request.session.rows = rows
        response.render(controllerName + "/" + "index.html", 
        { 
            rows: request.session.rows,
            errorMessage: "", 
	        	clientName: "",
	        	clientPhone: "",
	        	clientClass:"",
	        	clientSession:"",
	        	clientQuantity:"",
	        	clientEmail:""
        });
      });
	   
	}
	
	this.clearDB = function () {
	  
	  connection.query('TRUNCATE TABLE goods',
	   "",
	   function (err, rows) {
	      
        response.render(controllerName + "/" + "index.html", 
        { 
            rows: "",
            errorMessage: "", 
	        	clientName: "",
	        	clientPhone: "",
	        	clientClass:"",
	        	clientSession:"",
	        	clientQuantity:"",
	        	clientEmail:""
        });
        
      });
	  
	}
	
	this.post_product = function() {
	    
	    connection.query("insert into goods set goodsImg = ?,goodsName = ?, goodsPrice = ?,goodsQuantity = ?",
          [
           this.request.body.productImg,
           this.request.body.productName,
           this.request.body.productprice, 
           this.request.body.productQuantity,
           ],
           
          function (err, rows) {
            response.redirect("/home/index#mainProduct");
          }
          
        );
	}
	
	this.delete_product = function() {
	  
  	  connection.query('delete from goods where goodsID = ?', 
    		[
  			  this.request.query.id
  			],
  			
  		  function (err, rows) {
          response.redirect("/home/index#mainProduct");
        }
  		);
			
	}
	
	this.post_shopping = function() {
	  
    	connection.query("insert into product set clientName = ?,clientProduct = ?, clientQuantity = ?,clientAmount = ?,clientPhone = ?,clientEmail = ?,clientAddress= ?,clientMethod= ?",
          [
          this.request.body.shoppingName,
          this.request.body.shoppingProduct,
          this.request.body.shoppingQuantity, 
          this.request.body.shoppingAmount,
          this.request.body.shoppingPhonenember,
          this.request.body.shoppingEmail,
          this.request.body.shoppingAddress,
          this.request.body.shoppingMethod
          ]
           
          //function (err, rows) {
          // response.redirect("/home/index");
          //}
          
        );
        
        var transporter = nodeMailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // use SSL
          auth: {
            user: 'allen420318@gmail.com',
            pass: 'chya800321'
          }
        });
        
        var wrap = "\r\n";
        var space = "\v"
        var mailOptions = {
          from: 'allen420318@gmail.com',
          to: this.request.body.shoppingEmail,
          subject:'訂單建立成功',
          text: '訂單資料如下' + wrap +
        		    '姓名：' + this.request.body.shoppingName + wrap +
        		    '產品名稱：' + this.request.body.shoppingProduct + wrap +
                '產品數量：' + this.request.body.shoppingQuantity + wrap +
                '消費金額：NT$' + this.request.body.shoppingAmount + wrap +
                '聯絡電話：' + this.request.body.shoppingPhonenember + wrap +
                '電子信箱：' + this.request.body.shoppingEmail + wrap +
                '聯絡地址：' + this.request.body.shoppingAddress + wrap +
                '以上資料有誤時，請聯絡店家進行確認，謝謝！' + wrap + wrap +
                '穗藝花坊' + wrap + '04-2243-0766' + wrap + 'Suei-Yi@gmail.com',
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            response.redirect("/home/clearDB");
          }
        });
	  
	}
	
	
	this.post_class = function() {
	    
    	connection.query("insert into class set clientClass = ?,clientSession = ?, clientName = ?,clientQuantity = ?,clientPhone = ?,clientEmail= ?",
          [
           this.request.body.classHeading,
           this.request.body.classSession,
           this.request.body.className, 
           this.request.body.classNum,
           this.request.body.classPhonenember,
           this.request.body.classEmail
           ]
           
          //function (err, rows) {
          // response.redirect("/home/index");
          //}
          
        );
        
        var transporter = nodeMailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // use SSL
          auth: {
            user: 'allen420318@gmail.com',
            pass: 'chya800321'
          }
        });
        
        var wrap = "\r\n";
        var space = "\v"
        var mailOptions = {
          from: 'allen420318@gmail.com',
          to: this.request.body.classEmail,
          subject:this.request.body.classHeading + space +'課程預約成功',
          text: '預約資料如下' + wrap +
        		    '場次：' + this.request.body.classSession + wrap +
        		    '姓名：' + this.request.body.className + wrap +
                '人數：' + this.request.body.classNum + wrap +
                '聯絡電話：' + this.request.body.classPhonenember + wrap +
                '電子信箱：' + this.request.body.classEmail + wrap +
                '以上資料有誤時，請聯絡店家進行確認，謝謝！' + wrap + wrap +
                '穗藝花坊' + wrap + '04-2243-0766' + wrap + 'Suei-Yi@gmail.com',
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            response.redirect("/home/index#mainClass");
          }
        });
	}
	
	this.post_inquire = function() {
	  
	    var error = "";
	    request.session.inquireName = this.request.body.inquireName;
  		request.session.inquirePhonenember = this.request.body.inquirePhonenember;
  		
  	  connection.query('select * from class where clientName = ? and clientPhone = ?', 
  		[
			  this.request.body.inquireName,
			  this.request.body.inquirePhonenember
			],
			
  		function(err, rows) {
  			if (err)	{
  				console.log(JSON.stringify(err));
  				return;
  			}
  			
  			if (rows == "") {
  		   error += "查無資料，請重新輸入。"
  		  
			   response.render(controllerName + "/" + "index.html",
  		    {	
  		      rows: request.session.rows,
  		      errorMessage: error, 
 	          clientName:request.session.inquireName,
	        	clientPhone:request.session.inquirePhonenember,
	        	clientClass:"",
	        	clientSession:"",
	        	clientQuantity:"",
	        	clientEmail:""
  		    });
  		    // 	response.send(JSON.stringify(rows));
			   }
			   
			   if (rows != "") {
  		  // response.send(JSON.stringify(rows[0].clientClass));
  		   request.session.inquireClass = rows[0].clientClass;
  		   request.session.inquireSession = rows[0].clientSession;
  		   request.session.inquireQuantity = rows[0].clientQuantity;
  		   request.session.inquireEmail = rows[0].clientEmail;
  		   
			   response.render(controllerName + "/" + "index.html",
  		    {	
  		      rows: request.session.rows,
  		      errorMessage: error, 
 	          clientName:request.session.inquireName,
	        	clientPhone:request.session.inquirePhonenember,
	        	clientClass:request.session.inquireClass,
	        	clientSession:request.session.inquireSession,
	        	clientQuantity:request.session.inquireQuantity,
	        	clientEmail:request.session.inquireEmail
  		    });
  		    
			   }
			   
    		}
  		);

	}
	
	this.delete_inquire = function() {
	  
	  connection.query('delete from class where clientName = ? and clientPhone = ?', 
  		[
			  this.request.body.inquireName,
			  this.request.body.inquirePhonenember
			]
			
		  // 	function (err, rows) {
      //    response.redirect("/home/index#mainClass");
      //  }
			);
			
			var transporter = nodeMailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // use SSL
          auth: {
            user: 'allen420318@gmail.com',
            pass: 'chya800321'
          }
        });
        
        var wrap = "\r\n";
        var space = "\v"
        var mailOptions = {
          from: 'allen420318@gmail.com',
          to: this.request.body.inquireEmail,
          subject:this.request.body.inquireClass + space +'課程預約已取消',
          text: '歡迎再次預約新課程，謝謝！' + wrap + wrap +
                '穗藝花坊' + wrap + '04-2243-0766' + wrap + 'Suei-Yi@gmail.com',
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            response.redirect("/home/index#mainClass");
          }
        });
	  
	}
	
	this.post_connect = function() {
		
		var transporter = nodeMailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // use SSL
          auth: {
            user: 'allen420318@gmail.com',
            pass: 'chya800321'
          }
        });
        
        if(this.request.body.InputGender == 0) {
            this.request.body.InputGender = "先生"
        }else{
            this.request.body.InputGender = "小姐"
        }
        var wrap = "\r\n";
        var mailOptions = {
          from: 'allen420318@gmail.com',
          to: 'allen420318@gmail.com',
          subject: '服務建議單',
          text: '姓名：' + this.request.body.InputName + wrap +
                '性別：' + this.request.body.InputGender + wrap +
                '聯絡電話：' + this.request.body.InputPhonenember + wrap +
                '電子信箱：' + this.request.body.InputEmail + wrap +
                '聯絡事項：' + this.request.body.InputOpinion,
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            response.redirect("/home/index#mainConnect");
          }
        });
		
	}
	
}
