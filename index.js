const gm = require('gm').subClass({imageMagick: true});

exports.handler = (event, context, callback) => {

    console.log('Received event:', JSON.stringify(event, null, 2));
    let inputBuffer = 'originalpics/picture006.jpg'; 	//Change to the input picture
    let dest = 'editedpics/cropPicture006.jpg'		//Change to the destination for the picture
    let width = height = 200;
    let largerDimen;

	gm(inputBuffer).size((err, value)=>{
	    	//Saving height value
	    	if(value['height']>value['width']){
	    		largerDimen = "Height is larger than width";
	    		gm(inputBuffer)
	    		.resize(null, 200)
	    		.write(dest, function (err){
	    			if(err) callback(err);
	    			callback(null, "success");
	    		});
		//Saving width value	
	    	}else{
	    		largerDimen = "Width is larger than Height";
	    		gm(inputBuffer)
	    		.resize(200)
	    		.write(dest,function (err){
	    			if(err) callback(err);
	    			callback(null, "success");
	    		});
	        }
	    	callback(null, "Crop Successful");
	});
    		
}
    

    