'use strict';
const sharp = require('sharp');
const AWS = require('aws-sdk');
const fileType = require('file-type');
const s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'us-east-1'});

function getParams(image_name_ext, data, imageContentType){

    let params = {
        Bucket: "coachpic.healthlate.com", 
        Key:  image_name_ext, 
        Body: data, 
        ContentType: imageContentType
        
    };
    return params;
}

exports.handler = (event, context, callback) => {
    let this_id = -1;
    this_id = event.coachid_internal;
    const req = event;
    const operation = req.operation;
    let height = 200;
    let width = 200;
    let imageData;
    
    let fileName = "coachid_" +this_id; 
    let imageContentType;
    let image_name_ext
    delete req.operation;
    
    //Possible do a safety check and pull all valid coachID from the database to check against. 
    if (this_id <= 0) {
        console.log("invalid coachID");
        callback("Invalid coachID");
    }
  
    //Only continue if their is a valid base64Image in the body. 
    if (!req.base64Image) {
        const msg = 'Invalid resize request: no "base64Image" field supplied';
        console.log(msg);
        return callback(msg);
    }
    //Sharp will resize a base64 image to 200 x 200
    //Output is forced to be PNG
    //Output is a buffer. 
    sharp(new Buffer(req.base64Image, 'base64'))
    .resize(height, width)
    .png()
    .toBuffer()
    .then( data => {

        console.log("data")
        console.log(data);
        image_name_ext = fileName+".png";

        //get the params for s3
        let file_params = getParams(image_name_ext, data, imageContentType);
        var putObjectPromise = s3.putObject(file_params).promise();
        putObjectPromise.then( data => {

            console.log("s3 data");
            console.log(data);
            console.log("successfully upladed the image");
            callback(null, "https://s3.amazonaws.com/coachpic.healthlate.com/"+image_name_ext);

        }).catch( err => {
            console.log("s3 error: " + err);

            //console.log("Error uploading data: ", data);
            callback(null, err);
        })
            
               
        })
    .catch(err => {
        console.log("Error")
        callback("Error");
    })
        
     

       
    
};