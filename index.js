'use strict';

const im = require('imagemagick');
const fs = require('fs');


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

const resize = (req, callback) => {
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
                callback(null, postProcessResource(resizedFile, (file) => new Buffer(fs.readFileSync(file)).toString('base64')));
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
     console.log("LAmbda started at 3:00");
     let responseCode = 200;
     let this_coachid = 0;
     
    console.log(JSON.stringify(response));
    
    
    if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
        if (event.queryStringParameters.coachid !== undefined && 
            event.queryStringParameters.coachid !== null && 
            event.queryStringParameters.coachid !== "") {
                
                this_coachid = event.queryStringParameters.coachid;
        }
    }
    
    console.log ("Coach ID should be: " + this_coachid + " !!!");
    
    
    const req = event;
    var encodedImage = new Buffer( req.body, 'binary').toString('base64');
    //let buf = new Buffer(req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""),'base64')
    //const operation = "resize";
    //console.log(buf.toString('utf8'));
    const operation = 'ping';
    
    //delete req.operation;
    if (operation) {
        console.log(`Operation ${operation} 'requested`);
    }
    
    
    //callback(null, response);
    var response = {
        
        statusCode: responseCode,
        headers: {
            "x-custom-header" : "my custom header value"
        },
        body: JSON.stringify(responseBody),
        isBase64Encoded : true
    };
    
    switch (operation) {
        case 'ping':
            //callback(null, 'pong');
            callback(null, response);
            break;
        case 'getDimensions':
            req.customArgs = ['-format', '%wx%h'];
            /* falls through */
        case 'identify':
            identify(req, callback);
            break;
        case 'thumbnail':  // Synonym for resize
        case 'resize':
            resize(req, callback);
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

// The output from a Lambda proxy integration must be 
    // of the following JSON object. The 'headers' property 
    // is for custom response headers in addition to standard 
    // ones. The 'body' property  must be a JSON string. For 
    // base64-encoded payload, you must also set the 'isBase64Encoded'
    // property to 'true'.
    /*
    var response = {
        statusCode: responseCode,
        headers: {
            "x-custom-header" : "my custom header value"
        },
        body: JSON.stringify(responseBody)
    };
    console.log("response: " + JSON.stringify(response))
    callback(null, response);
    */
