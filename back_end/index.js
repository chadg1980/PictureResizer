'use strict';
const sharp = require('sharp');
const AWS = require('aws-sdk');
const fileType = require('file-type');
const s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'us-east-1'});

function getContent(ext){
    if(ext == 'png' || ext == 'PNG'){
            return 'image/png'
        }
    if(ext == 'jpg' || ext == 'JPG'){
        return 'image/jpeg'   
    }
   
    console.log("ext unknown " + ext);
    callback(null, "unknown file extention " + ext);
        
}

exports.handler = (event, context, callback) => {
    let this_id = -1;
    this_id = event.coachid_internal;
    const req = event;
    const operation = req.operation;
    let height = 200;
    let width = 200;
    let imageData;
    let ext;
    let fileName = "coachid_" +this_id; 
    let imageContentType;
    delete req.operation;
    /*
    if (operation) {
        console.log(`Operation ${operation} 'requested`);
    }
    */

    if (!req.base64Image) {
        const msg = 'Invalid resize request: no "base64Image" field supplied';
        console.log(msg);
        return callback(msg);
    }

    sharp(new Buffer(req.base64Image, 'base64'))
    .resize(height, width)
    .toBuffer(function(err, data, info){
        if(err){
            console.log(err.message);
            callback(err.message);
        }
        
        console.log("info");
        console.log(info);
        console.log("data")
        console.log(data);
        ext = info.format;
        if(ext == 'jpeg' || ext == 'JPEG'){
            ext = "jpg";
        }
        console.log("extention is " + ext);
        imageContentType = getContent(ext);

        let image_name_ext = fileName+"."+ext;
        

        let file_params = {
            Bucket: "coachpic.healthlate.com", 
            Key:  image_name_ext, 
            Body: data, 
            ContentType: imageContentType
            
        };

        s3.putObject(file_params, function (err, data){
            if(err){

                console.log("s3 error: " + err);
                    //console.log("Error uploading data: ", data);
                    callback(null, err);
                }else{
                    console.log("s3 data");
                    console.log(data);
                    console.log("successfully upladed the image");
                    callback(null, "https://s3.amazonaws.com/coachpic.healthlate.com/"+image_name_ext);
                }


            });
    })
};