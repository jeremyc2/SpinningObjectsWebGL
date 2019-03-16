var gl
var frames
vertexShaderPaths = ['shaders/defaultVertexShader.glsl']
fragShaderPaths = ['shaders/defaultShader.glsl']//'shaders/defaultShader.glsl'] // 'shaders/imageFragShader.glsl'
var resources = {
  length: 0,
  fragShaders: { length: 0 },
  vertexShaders: { length: 0 },
  images: []
}
var imagePaths = ['boxSide.jpg']

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

function executeDrawTextureCube () {
  var vertexData = [
    // X, Y, Z           U, V
    // Top
    -1.0,
    1.0,
    -1.0,
    0,
    0,
    -1.0,
    1.0,
    1.0,
    0,
    1,
    1.0,
    1.0,
    1.0,
    1,
    1,
    1.0,
    1.0,
    -1.0,
    1,
    0,

    // Left
    -1.0,
    1.0,
    1.0,
    0,
    0,
    -1.0,
    -1.0,
    1.0,
    1,
    0,
    -1.0,
    -1.0,
    -1.0,
    1,
    1,
    -1.0,
    1.0,
    -1.0,
    0,
    1,

    // Right
    1.0,
    1.0,
    1.0,
    1,
    1,
    1.0,
    -1.0,
    1.0,
    0,
    1,
    1.0,
    -1.0,
    -1.0,
    0,
    0,
    1.0,
    1.0,
    -1.0,
    1,
    0,

    // Front
    1.0,
    1.0,
    1.0,
    1,
    1,
    1.0,
    -1.0,
    1.0,
    1,
    0,
    -1.0,
    -1.0,
    1.0,
    0,
    0,
    -1.0,
    1.0,
    1.0,
    0,
    1,

    // Back
    1.0,
    1.0,
    -1.0,
    0,
    0,
    1.0,
    -1.0,
    -1.0,
    0,
    1,
    -1.0,
    -1.0,
    -1.0,
    1,
    1,
    -1.0,
    1.0,
    -1.0,
    1,
    0,

    // Bottom
    -1.0,
    -1.0,
    -1.0,
    1,
    1,
    -1.0,
    -1.0,
    1.0,
    1,
    0,
    1.0,
    -1.0,
    1.0,
    0,
    0,
    1.0,
    -1.0,
    -1.0,
    0,
    1
  ]

  var params = [
    createParams(
      'aVertexPosition',
      3,
      gl.ARRAY_BUFFER,
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      0
    ),
    createParams(
      'aVertexTexCoord',
      2,
      gl.ARRAY_BUFFER,
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT
    )
  ]
  var vertexBuffer = buildBuffer(params, vertexData)

  var boxIndices = [
    // Top
    0,
    1,
    2,
    0,
    2,
    3,

    // Left
    5,
    4,
    6,
    6,
    4,
    7,

    // Right
    8,
    9,
    10,
    8,
    10,
    11,

    // Front
    13,
    12,
    14,
    15,
    14,
    12,

    // Back
    16,
    17,
    18,
    16,
    18,
    19,

    // Bottom
    21,
    20,
    22,
    22,
    20,
    23
  ]

  params = [createParams('indices', 6, gl.ELEMENT_ARRAY_BUFFER)]
  var indicesBuffer = buildBuffer(params, boxIndices)

  // Can add more attributes
  var buffers = [vertexBuffer, indicesBuffer]

  // TODO: Change Me
  var uniforms = [
    { name: 'uModelViewMatrix', matrix: buildModelView() },
    { name: 'uProjectionMatrix', matrix: buildProjection() }
  ]

  bindTexture(resources.images[0])

  drawCube(
    resources.vertexShaders.imageVertShader,
    resources.fragShaders.imageFragShader,
    boxIndices.length,
    buffers,
    uniforms
  )
}

function bindTexture (image) {
  //
  // Create texture
  //
  var boxTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, boxTexture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
}

function executeDrawTextureCube(){
  
  var vertexData = 
	[ // X, Y, Z           U, V
		// Top
		-1.0, 1.0, -1.0,   0, 0,
		-1.0, 1.0, 1.0,    0, 1,
		1.0, 1.0, 1.0,     1, 1,
		1.0, 1.0, -1.0,    1, 0,

		// Left
		-1.0, 1.0, 1.0,    0, 0,
		-1.0, -1.0, 1.0,   1, 0,
		-1.0, -1.0, -1.0,  1, 1,
		-1.0, 1.0, -1.0,   0, 1,

		// Right
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,   0, 1,
		1.0, -1.0, -1.0,  0, 0,
		1.0, 1.0, -1.0,   1, 0,

		// Front
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,    1, 0,
		-1.0, -1.0, 1.0,    0, 0,
		-1.0, 1.0, 1.0,    0, 1,

		// Back
		1.0, 1.0, -1.0,    0, 0,
		1.0, -1.0, -1.0,    0, 1,
		-1.0, -1.0, -1.0,    1, 1,
		-1.0, 1.0, -1.0,    1, 0,

		// Bottom
		-1.0, -1.0, -1.0,   1, 1,
		-1.0, -1.0, 1.0,    1, 0,
		1.0, -1.0, 1.0,     0, 0,
		1.0, -1.0, -1.0,    0, 1,
	];

  
  var params = [createParams('aVertexPosition', 3, gl.ARRAY_BUFFER, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 0), 
                  createParams('aVertexTexCoord', 2, gl.ARRAY_BUFFER, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT)]
  var vertexBuffer = buildBuffer(params, vertexData)

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
  ];

  params = [createParams('indices',6,gl.ELEMENT_ARRAY_BUFFER)]
  var indicesBuffer = buildBuffer(params, boxIndices)

  // Can add more attributes
  var buffers = [vertexBuffer, indicesBuffer]

  // TODO: Change Me
  var uniforms = [ {name: 'uModelViewMatrix', matrix: buildModelView()}, {name: 'uProjectionMatrix',matrix: buildProjection()} ]

  bindTexture(resources.images[0])
  
  drawCube(
    resources.vertexShaders.imageVertShader,
    resources.fragShaders.imageFragShader,
    boxIndices.length,
    buffers,
    uniforms
  )

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
  if (err) {
    callback(err)
  } else {
    var startFrames = frames
    setTimeout(function () {
      callback(err, frames - startFrames)
    }, 1000)
  }
}

function loadResourceCategory (resourceList, category) {
  for (i = 0, len = resourceList.length; i < len; i++) {
    loadTextResource(resourceList[i], function (err, text) {
      if (err) {
        console.log(err)
      } else {
        var path = resourceList[i]
        resources[category][
          path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
        ] = text
        resources[category].length++
        resources.length++
      }
    })
  }
}

function loadShaderResources (vertexShaderResources, fragShaderResources) {
  loadResourceCategory(vertexShaderResources, 'vertexShaders')
  loadResourceCategory(fragShaderResources, 'fragShaders')
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
}

function main () {
  var backgroundColor = [0.0, 0.0, 0.0, 1.0]

  initializeWebGL()
  // for consistent call rate on keypress, call only millisecond
  setInterval(processUserInputs(), 1)
  calculateFramesPerSecond(null, function (err, framesPerSecond) {
    console.log(framesPerSecond + ' Frames Per Second')
  })

  loadShaderResources(vertexShaderPaths, fragShaderPaths)
  for (i = 0, len = imagePaths.length; i < len; i++) {
    loadImage(imagePaths[i], function (err, image) {
      if (err) {
        console.log(err)
      } else {
        resources.length++
        resources.images[resources.images.length] = image
      }
    })
  }

  var loop = function () {
    if (
      resources.length ==
      vertexShaderPaths.length + fragShaderPaths.length + imagePaths.length
    ) {
      clearCanvas(backgroundColor)

      drawObjects()
      // testDrawTriangle()
      // executeDrawSquare()
      // executeDrawCube()
      // executeDrawTextureCube()
      frames++
    }

    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}

