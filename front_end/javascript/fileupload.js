//URLurl: 'https://gbb8xz2947.execute-api.us-east-1.amazonaws.com/example_test'
/*
'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
//curl --request POST https://gbb8xz2947.execute-api.us-east-1.amazonaws.com/example_test/headersresource -H "Content-Type: application/json" -H "header1: API Gateway and AWS Lambda" -X POST -d "{\"API_body\": \"This is the body\"}" 
*/

//try this
//https://code.tutsplus.com/tutorials/uploading-files-with-ajax--net-21077

$(document).ready(function(){
    $( '#uploadForm').submit(function( event ){
        event.preventDefault();
        let form = $( this );
        term = form.find( "input[name='coachid']").val();
        console.log(term);
                
        $.ajax({
            url : 'https://gbb8xz2947.execute-api.us-east-1.amazonaws.com/example_test',
            Accept: "images/*", 
            type: 'post',
            processData: false, 
            headers: {
               'Content-Type': 'application/json', 
               'header1': 'API Gateway and AWS Lambda'
               
            },
            contentType: "application/json", 
            
            dataType: 'json',
            success: function(data){
                console.log("success  " + data);
            }, 
            error: function(err){
                console.log("error "+ err.error);
            }
        });
    });

});



 


