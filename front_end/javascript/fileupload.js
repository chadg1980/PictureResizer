Dropzone.options.uploadWidget = {
	// The camelized version of the ID of the form element

  // The configuration we've talked about above
  paramName: 'file',
  url: 'http://127.0.0.1:3000/upload',
  maxFilesize: 5, // MB
  maxFiles: 1,
  uploadMultiple:  false,
  dictDefaultMessage: 'Drag an image here to upload, or click to select one',
  thumbnailWidth: 200, 
  thumbnailHeight: 200,

  headers: {
    'x-csrf-token': $('meta[name="csrf-token"]').attr('content'),
    'Access-Control-Allow-Origin': '*',
  },
  acceptedFiles: 'image/*',

  init: function() {
  	

  	this.on("error", function(file, e){
  		console.log("error: " + e);
  	});

    
    this.on('success', function( file, resp ){
    	
      console.log( file );
      console.log( resp );
    });

       
    this.on('thumbnail', function(file) {
    	
      if ( file.width < 100 || file.height < 100 ) {
        file.rejectDimensions();
      }
      else {
      	 file.acceptDimensions();
      }
      
    });
    //This is giving undefined values
    //https://stackoverflow.com/questions/25927381/undefined-returned-when-accessing-some-listed-properties-of-file-object
    this.on("sending", function(file, xhr, formData){
    	formData.append("height", file.height);
    	formData.append("width", file.width);
    })

    this.on('complete', function(file){
    	console.log("complete");

    });

  },
  accept: function(file, done) {
    file.acceptDimensions = done;
    file.rejectDimensions = function() {
      done('The image must be at least 100 x 100px')
    };
    done();
  }
};