const gm = require('gm').subClass({imageMagick: true});
const express = require('express');
//const upload = require('jquery-file-upload-middleware');
const router = express.Router();
const multer = require('multer');
const jimp = require('jimp');
const util = require('util');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const fs = require('fs');
const http = require('http');
const sizeOf = require('image-size');
const fileType = require('file-type');
const app = express();
var env = process.env.NODE_ENV || 'development';


app.get('/', (req, res)=>{
	res.send('Good to Go');
})

const upload = multer({dest: __dirname+'/uploads'});

app.post( '/upload',  upload.single('file'), (req, res, next) =>{
	if(!req.file.mimetype.startsWith('image/')){
		return res.status( 422 ).json({
			error: 'The uploaded file must be an image'
		});
	}
	
	console.log(req.body);
	console.log("************************");
	console.log("file Received" + util.inspect(req.file, {showHidden: false, depth: null}));
	console.log("************************");
	//convertImages(req.file.dataURL);


	return res.status(200).send(req.file);
	    
	
	
});


app.listen(3000, function(){
	console.log("app listening on port 3000!");
})

//Trying to convert images in this funtion
//based on http://markocen.github.io/blog/pre-processing-uploaded-image-on-nodejs.html
function convertImages(file){
	let type = fileType(file);
	new jimp(file, (err, img)=>{
		img.resize(200, 200);
	})
}



/*
exports.handler = (event, context, callback) => {

    //console.log('Received event:', JSON.stringify(event, null, 2));


    let inputBuffer = 'originalpics/picture006.jpg'; 	//Change to the input picture
    
    let dest = 'editedpics/cropPicture006.jpg'		//Change to the destination for the picture
    let width = height = 200;
    let largerDimen;


   

    callback(null, "not success");
    */

   /*
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
	*/
	
    		
//}
    

    