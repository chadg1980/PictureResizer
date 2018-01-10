'use strict';

const sharp = require('sharp');
//const fs = require('fs');
const AWS = require('aws-sdk');
//const fileType = require('file-type');
//let s3 = new AWS.S3();

let getFile = function(coachid, buffer){
    //fileName = "coachid_" + coachid, 
    let params = {
            Bucket: "coachpic.healthlate.com", 
            Key:  this_id + ".png"
            Body: buf, 
            ContentType: 'image/png', 
            ACL: 'public-read'
        };
    return;
}

exports.handler = (event, context, callback) => {
    let this_id = -1;

    this_id = event.coachid_internal;

    console.log('Lambda started 001, coachid: ' + this_id + ' .');
    const req = event;
    const operation = req.operation;
    delete req.operation;
    if (operation) {
        console.log(`Operation ${operation} 'requested`);
    }

    if (!req.base64Image) {
        const msg = 'Invalid resize request: no "base64Image" field supplied';
        console.log(msg);
        return callback(msg);
    }

    // If neither height nor width was provided, turn this into a thumbnailing request
    if (!req.height && !req.width) {
        req.width = 200;
    }

    let fileMime = fileType(file);
    console.log("file type = " + fileMime.ext);
    console.log("Hello0");

    let file = getFile(fileMime, this_id, req.base64Image);
    
    sharp(new Buffer(req.base64Image, 'base64')).resize(200, 200).toBuffer(function(err, data) { 
        if(err){
            throw (err);
        }
        
        let buf = Buffer.from(data.toString('base64').replace(/^data:image\/\w+;base64,/, ""),"base64");
        console.log("Hello1");
        /*
        s3.putObject(params, function (err, data){
            if(err){

                console.log("s3 error: " + err);
                    //console.log("Error uploading data: ", data);
                    callback(null, err);
                }else{
                    console.log("successfully upladed the image");
                    callback(null, "success");
                }
                console.log("error line 82");
                callback("error");
                
            });
            */
    });
    
};