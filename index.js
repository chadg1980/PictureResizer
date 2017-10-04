const gm = require('gm').subClass({imageMagick: true});

exports.handler = (event, context, callback) => {

    console.log('Received event:', JSON.stringify(event, null, 2));
    let inputBuffer = 'originalpics/picture006.jpg';
    let dest = 'editedpics/cropPicture006.jpg'
    let width = height = 200;
    let largerDimen;

    gm(inputBuffer).size((err, value)=>{
    	if(value['height']>value['width']){
    		
    		largerDimen = value['height'];
    		gm(inputBuffer)
    		.resize(null, 200)
    		.write(dest, function (err){
    			if(err) callback(err);
    			callback(null, "success");
    		});	
    	}else{
    		largerDimen = value['width'];
    		gm(inputBuffer)
    		.resize(200)
    		.write(dest,function (err){
    			if(err) callback(err);
    			callback(null, "success");
    		});
    	}
    	callback(null, JSON.stringify(value) + ": " + largerDimen);
    	

    });
    		
  
    
 

}
    

    