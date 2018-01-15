$(document).ready(function(){
    $( '#uploadForm').submit(function( event ){
        event.preventDefault();

        let myData = $('#uploadForm').serializeArray();
        
        let fileData = $('#picfile')[0].files[0];
        if(fileData.length === 0 || fileData.length >= 2){
            alert("must upload 1 image");
        }
        console.log(fileData);
        
        let acceptType = {
            binary : ["image/png", "image/jpeg", "image/gif"]
        };
        let coachid = myData[0].value;
        const url_up = 'https://gbb8xz2947.execute-api.us-east-1.amazonaws.com/coach_pic?coachid='
        let url_with_param = url_up + coachid;

        $.ajax({
           url : url_with_param,
           accepts: {
            text: "text/plain", 
            JSON: "application/json"
        }, 

        method: 'post',
        processData: false,
        data: fileData, 
        headers: {
         'Content-Type': 'image/png',


     },
     ContentType: false, 
     xhr : function(){
        let xhr = new XMLHttpRequest();
        xhr.overrideMimeType("text/plain");

        xhr.upload.addEventListener('progress', function(event){
            let progressBar = $('.progress-bar');

            if(event.lengthComputable){
                let percent = (event.loaded / event.total) * 100;
                progressBar.width(percent + '%');
                if(percent === 100){
                    progressBar.removeClass('active');
                }
            }
        });
        return xhr;
    }


}).done(isSuccess).fail(function (xhr, status){

    console.log("status: " + status);
});
function isSuccess(data, status, err){
 console.log("status: " + status);
 console.log(err);

 $('#response').append('<p> uploaded picture for coach ID: ' + coachid+ '</p>');
 $('#previewImage').attr('src', data);
 $('#response').append('<p> data: ' + data +" </p>");
}
})
});

















