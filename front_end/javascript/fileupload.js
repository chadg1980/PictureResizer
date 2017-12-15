//URLurl: 'https://gbb8xz2947.execute-api.us-east-1.amazonaws.com/example_test'
/*
'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
//curl --request POST https://gbb8xz2947.execute-api.us-east-1.amazonaws.com/example_test/headersresource -H "Content-Type: application/json" -H "header1: API Gateway and AWS Lambda" -X POST -d "{\"API_body\": \"This is the body\"}" 
*/
//https://nodejs.org/api/http.html

//http://www.codedodle.com/2016/10/nodejs-image-uploader-using-express-and.html

//try this
//https://code.tutsplus.com/tutorials/uploading-files-with-ajax--net-21077
//https://github.com/krisgholson/serverless-thumbnail

$(document).ready(function(){
    $( '#uploadForm').submit(function( event ){
        event.preventDefault();

        
        let myData = $('#uploadForm').serializeArray();
        let fileData = document.getElementById("picfile").files;
        if(fileData.length === 0 || fileData.length >= 2){
            alert("must upload 1 image");
        }

        let fileDetail = {
            "name" : fileData[0].name,
            "size" : fileData[0].size,
            "type" : fileData[0].type,
        };
        
        //myData.push( {name:"filedata", value: fileData[0]} );
        myData.push(fileDetail);
        
        console.log(myData);        
        myData = JSON.stringify( myData ); 
        console.log(myData);        
                        
        $.ajax({
            url : 'https://gbb8xz2947.execute-api.us-east-1.amazonaws.com/example_test',
            Accept: "images/*", 
            type: 'post',
            processData: false,
            data: myData, 
            headers: {
               'Content-Type': 'application/json', 
               'header1': 'API Gateway and AWS Lambda'
               
            },
            contentType: false, 
            xhr : function(){
                let xhr = new XMLHttpRequest();
                xhr.upload.addEventListener('progress', function(event){
                    let progressBar = $('.progress-bar');

                    if(event.lengthComputable){
                        let percent = (event.loaded / event.total) * 100;
                        progressBar.width(percent + '%');
                        if(percent === 100){
                            progressBar.removeClass('active')
                        }
                    }
                });
                return xhr;
            }
            
            /*dataType: 'json',
            success: function(data){
                $("#response").append("<p> uploaded picture for coach ID: " + data.value + "</p>");
                console.log(data);
            }, 
            error: function(err){
                console.log("error "+ err.error);
            }
        });*/
        }).done(isSuccess).fail(function ( xhr, status){
            console.log(status);
        });
        function isSuccess(data){
                       
            $("#response").append("<p> uploaded picture for coach ID: " + data.value + "</p>");
    }
    })
});

    







 


