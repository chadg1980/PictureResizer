'use strict';

const im = require('imagemagick');
const fs = require('fs');
var S3 = require('aws-sdk/clients/s3');


const postProcessResource = (resource, fn) => {
    let ret = null;
    if (resource) {
        if (fn) {
            ret = fn(resource);
        }
        try {
            fs.unlinkSync(resource);
        } catch (err) {
            // Ignore
        }
    }
    return ret;
};


const identify = (req, callback) => {
    if (!req.base64Image) {
        const msg = 'Invalid identify request: no "base64Image" field supplied';
        console.log(msg);
        return callback(msg);
    }
    const tmpFile = `/tmp/inputFile.${(req.inputExtension || 'png')}`;
    const buffer = new Buffer(req.base64Image, 'base64');
    fs.writeFileSync(tmpFile, buffer);
    const args = req.customArgs ? req.customArgs.concat([tmpFile]) : tmpFile;
    im.identify(args, (err, output) => {
        fs.unlinkSync(tmpFile);
        if (err) {
            console.log('Identify operation failed:', err);
            callback(err);
        } else {
            console.log('Identify operation completed successfully');
            callback(null, output);
        }
    });
};

const resize = (coachid, req, callback) => {
    
    const resizeReq = req;
    
    if (!resizeReq.base64Image) {
        const msg = 'Invalid resize request: no "base64Image" field supplied';
        console.log(msg);
        return callback(msg);
    }
    // If neither height nor width was provided, turn this into a thumbnailing request
    if (!resizeReq.height && !resizeReq.width) {
        resizeReq.width = 200;
    }
    const resizedFile = `/tmp/resized.${(resizeReq.outputExtension || 'png')}`;
    const buffer = new Buffer(resizeReq.base64Image, 'base64');
    delete resizeReq.base64Image;
    delete resizeReq.outputExtension;
    resizeReq.srcData = buffer;
    resizeReq.dstPath = resizedFile;
    try {
        im.resize(resizeReq, (err) => {
            if (err) {
                throw err;
            } else {
                console.log('Resize operation completed successfully');
                console.log("buffer start");
                let buf = postProcessResource(resizedFile, (file) =>new Buffer(fs.readFileSync(file)).toString('base64'));
                console.log("buffer completed");
                
                
                var data = {
                    Bucket: "coachpic.healthlate.com", 
                    Key: "coachid", 
                    Body: buf, 
                    ContentTye: 'image/png', 
                    ACL: 'public-read'
                };
                S3.putObject(data, function (err, data){
                    if(err){
                        console.log("s3 error: " + err);
                        console.log("Error uploading data: ", data);
                    }else{
                        console.log("successfully upladed the image");
                    }
                    
                });
    
                
                callback(null, data);
            }
        });
    } catch (err) {
        console.log('Resize operation failed:', err);
        callback(err);
    }
};

const convert = (req, callback) => {
    const customArgs = req.customArgs || [];
    let inputFile = null;
    let outputFile = null;
    if (req.base64Image) {
        inputFile = `/tmp/inputFile.${(req.inputExtension || 'png')}`;
        const buffer = new Buffer(req.base64Image, 'base64');
        fs.writeFileSync(inputFile, buffer);
        customArgs.unshift(inputFile);
    }
    if (req.outputExtension) {
        outputFile = `/tmp/outputFile.${req.outputExtension}`;
        customArgs.push(outputFile);
    }
    im.convert(customArgs, (err, output) => {
        if (err) {
            console.log('Convert operation failed:', err);
            callback(err);
        } else {
            console.log('Convert operation completed successfully');
            postProcessResource(inputFile);
            if (outputFile) {
                callback(null, postProcessResource(outputFile, (file) => new Buffer(fs.readFileSync(file)).toString('base64')));
            } else {
                // Return the command line output as a debugging aid
                callback(null, output);
            }
        }
    });
};


exports.handler = (event, context, callback) => {
    let this_id = -1;
   
        this_id = event.coachid_internal;
    
    console.log('Lambda started, coachid: ' + this_id + ' .');
    const req = event;
    const operation = req.operation;
    delete req.operation;
    if (operation) {
        console.log(`Operation ${operation} 'requested`);
    }

    switch (operation) {
        case 'ping':
            callback(null, 'pong');
            break;
        case 'getDimensions':
            req.customArgs = ['-format', '%wx%h'];
            /* falls through */
        case 'identify':
            identify(req, callback);
            break;
        case 'thumbnail':  // Synonym for resize
        case 'resize':
            resize(this_id, req, callback);
            break;
        case 'getSample':
            req.customArgs = ['rose:'];
            req.outputExtension = req.outputExtension || 'png';
            /* falls through */
        case 'convert':
            convert(req, callback);
            break;
        default:
            callback(new Error(`Unrecognized operation "${operation}"`));
    }
};