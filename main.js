var gl;
var frames;

function initializeWebGL(){
    var canvas = document.getElementById("gl");

    gl = canvas.getContext("webgl") ||
         canvas.getContext("experimental-webgl") ||
         canvas.getContext("moz-webgl") ||
         canvas.getContext("webket-3d");

    if (gl){
        var extensions = gl.getSupportedExtensions();

        console.log(gl);
        console.log(extensions);

        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

    }else{
        console.log("WebGL not supported!");
    }
}

function loadResources(err, callback, resourceFiles){
    
}

function calculateFramesPerSecond(err, callback){
    if(err){
        callback(err);
    }
    else{
        var startFrames = frames;
        setTimeout(function(){ 
            callback(err, frames - startFrames); 
        }, 1000);
    }
}

function main(){

    initializeWebGL();

    frames = 0;

    calculateFramesPerSecond(null, function(err, framesPerSecond){
        console.log(framesPerSecond + " Frames Per Second");
    });

    var loop = function () {

        gl.clearColor(0.0,0.0,0.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        requestAnimationFrame(loop);

        frames++;

    }

    requestAnimationFrame(loop);

}