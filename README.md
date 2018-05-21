# Picture Resizer

    The picture resizer was originally developed to give an admin user the ability to upload and change their profile picture. 
    The front end of the Picture resizer is an HTML form that accepts an image and a coach ID. 
    The back end takes the original image and shrinks it to 200px by 200px and saves the smaller image in an S3 bucket that is accessible in the website to be used as a profile picture. 

## Front end
   
* HTML/CSS
* Javascript
* jQuery
 
## Back End
* Node.js
* AWS Lambda, API Gateway, S3
* [sharp](https://github.com/lovell/sharp) - Used to resize the images

