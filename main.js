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

function logFramesPerSecond(err){
    if(err){
        console.log(err);
    }
    else{
        var startFrames = frames;
        setTimeout(function(){ 
            console.log(frames - startFrames + " Frames per second"); 
        }, 1000);
    }
}

function main(){

    initializeWebGL();

    frames = 0;

    logFramesPerSecond();

    var loop = function () {

        gl.clearColor(0.0,0.0,0.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        requestAnimationFrame(loop);

        frames++;

    }

    requestAnimationFrame(loop);

}