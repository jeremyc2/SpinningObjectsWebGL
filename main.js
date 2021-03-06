var gl
var frames
vertexShaderPaths = ['shaders/defaultVertexShader.glsl', 'shaders/imageVertShader.glsl']
fragShaderPaths = ['shaders/defaultShader.glsl', 'shaders/imageFragShader.glsl']
var resources = {
  length: 0,
  fragShaders: { length: 0 },
  vertexShaders: { length: 0 },
  images: { length: 0}
}
var imagePaths = ['boxSide.jpg','fullRubix.jpg', 'SusanTexture.png', 'RexTexture.jpeg']

var canvas

function createParams (
  name,
  numComponents = 4,
  arrayType = gl.ARRAY_BUFFER,
  type = gl.FLOAT,
  normalize = false,
  stride = 0,
  offset = 0
) {
  return {
    name: name,
    numComponents: numComponents,
    type: type,
    normalize: normalize,
    stride: stride,
    offset: offset,
    arrayType: arrayType
  }
}

function initializeWebGL () {
  frames = 0
  var canvas = document.getElementById('gl')

  gl =
    canvas.getContext('webgl') ||
    canvas.getContext('experimental-webgl') ||
    canvas.getContext('moz-webgl') ||
    canvas.getContext('webket-3d')

  if (gl) {
    var extensions = gl.getSupportedExtensions()

    console.log(gl)
    console.log(extensions)

    // Set the view port
    gl.viewport(0, 0, canvas.width, canvas.height)
    // Enable the depth test
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.frontFace(gl.CCW)
    gl.cullFace(gl.BACK)
  } else {
    console.log('WebGL not supported!')
  }
}

function bindTexture(image){
	//
	// Create texture
	//
	var boxTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, boxTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		image
	);
}

function buildBuffer (paramsList, data) {
  params = paramsList[0]
  // Create an empty buffer object to store vertex buffer
  const buffer = gl.createBuffer()

  // Bind appropriate array buffer to it
  gl.bindBuffer(params.arrayType, buffer)

  // Pass the data to the buffer
  if (params.arrayType == gl.ARRAY_BUFFER) {
    gl.bufferData(params.arrayType, new Float32Array(data), gl.STATIC_DRAW)
  } else if (params.arrayType == gl.ELEMENT_ARRAY_BUFFER) {
    gl.bufferData(params.arrayType, new Uint16Array(data), gl.STATIC_DRAW)
  } else {
    alert('Buffer Type not Supported')
  }

  return {
    data: buffer,
    params: paramsList
  }
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader (type, source) {
  const shader = gl.createShader(type)

  // Send the source to the shader object

  gl.shaderSource(shader, source)

  // Compile the shader program

  gl.compileShader(shader)

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader)
    )
    gl.deleteShader(shader)
    return null
  }

  return shader
}
function attachShaders (shaders, buffers, uniforms) {
  var shaderProgram = gl.createProgram()
  var shaderLength = shaders.length
  for (var i = 0; i < shaderLength; ++i) {
    gl.attachShader(shaderProgram, shaders[i])
  }
  gl.linkProgram(shaderProgram)
  // Use the combined shader program object
  gl.useProgram(shaderProgram)

  // bind buffers and enable attributes
  for (i = 0; i < buffers.length; i++) {
    var buffer = buffers[i]
    var paramsList = buffer.params
    for (var j = 0; j < paramsList.length; ++j) {
      var params = paramsList[j]
      if (params.arrayType != gl.ELEMENT_ARRAY_BUFFER) {
        var location = gl.getAttribLocation(shaderProgram, params.name)
        // This is for multiple attributes coming from the same buffer
        // only bind it once
        if (j < 1) {
          gl.bindBuffer(params.arrayType, buffer.data)
        }
        gl.vertexAttribPointer(
          location,
          params.numComponents,
          params.type,
          params.normalize,
          params.stride,
          params.offset
        )
        gl.enableVertexAttribArray(location)
      } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.data)
      }
    }
  }

  for (var i = 0; i < uniforms.length; ++i) {
    // attach uniforms
    var uniformLocation = gl.getUniformLocation(shaderProgram, uniforms[i].name)

    gl.uniformMatrix4fv(uniformLocation, false, uniforms[i].matrix)
  }
}

function clearCanvas (backgroundColor) {
  // Clear the canvas
  gl.clearColor(
    backgroundColor[0],
    backgroundColor[1],
    backgroundColor[2],
    backgroundColor[3]
  )
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

function calculateFramesPerSecond (err, callback) {
  var startFrames = frames
  if (err) {
    callback(err)
  } else {
    setTimeout(function () {
      callback(err, frames - startFrames)
    }, 1000)
  }
}

function drawObjects () {
  if (buttons.cubeButton == 1) {
    executeDrawCube()
  }
  if (buttons.squareButton == 1) {
    executeDrawSquare()
  }
  if (buttons.plusButton == 1) {
    executeDrawPlus()
  }
  if (buttons.imageCubeButton == 1) {
    executeDrawTextureCube()
  }
  if (buttons.pyramidButton == 1) {
    executeDrawPyramid()
  }
  if (buttons.rubiksButton == 1) {
    executeDrawRubiksCube()
  }
  if (buttons.suzanneButton == 1) {
    executeDrawSuzanne()
  }
  if (buttons.TRexButton == 1) {
    executeDrawTRex()
  }
}

function fitToContainer(canvas){
  // Make it visually fill the positioned parent
  canvas.style.width ='100%';
  canvas.style.height='100%';
  // ...then set the internal size to match
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function main () {

  canvas = document.getElementById("gl");
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("mouseout", mouseUp, false);
  canvas.addEventListener("mousemove", mouseMove, false);

  canvas.addEventListener('touchstart', mouseDown);
  canvas.addEventListener('touchmove', mouseMove);
  canvas.addEventListener('touchend', mouseUp);
  canvas.addEventListener('touchleave', mouseUp);
  canvas.addEventListener('touchcancel', mouseUp);

  fitToContainer(canvas);

  //Start with the cube
  buttonClick("cubeButton")
  
  var backgroundColor = [1.0, 1.0, 1.0, 1.0]

  initializeWebGL()
  // for consistent call rate on keypress, call only millisecond
  setInterval(processUserInputs(), 1)
  calculateFramesPerSecond(null, function (err, framesPerSecond) {
    console.log(framesPerSecond + ' Frames Per Second')
  })

  loadShaderResources(vertexShaderPaths, fragShaderPaths)

  loadResourceCategory(imagePaths,"images", loadImage)

  var loop = function () {
    if (
      resources.length ==
      vertexShaderPaths.length + fragShaderPaths.length + imagePaths.length
    ) {
      clearCanvas(backgroundColor)

      drawObjects()

      frames++
    }

    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}

