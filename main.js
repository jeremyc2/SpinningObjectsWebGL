var gl
var frames
var canvasWidth = 4
var canvasHeight = 4;
vertexShaderPaths = ['shaders/defaultVertexShader.glsl']
fragShaderPaths = ['shaders/defaultShader.glsl']
var resources = {
  length: 0,
  fragShaders: { length: 0 },
  vertexShaders: { length: 0 }
}
var position = { up: 0, down: 0, left: 0, right: 0 }
var velocity = 0.1

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
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
  } else {
    console.log('WebGL not supported!')
  }
}

function processUserInputs () {
  $(document).keydown(function (e) {
    switch (e.keyCode) {
      case 65: // left (a)
        if (position.left - position.right <= canvasWidth)
        position.left = position.left + velocity
        break
      case 68: // right (d)
        if (position.left - position.right >= -canvasWidth)
        position.right = position.right + velocity
        break
      case 83: // down (s)
        if (position.up - position.down >= -canvasHeight)
        position.down = position.down + velocity
        break
      case 87: // up (w)
      if (position.up - position.down <= canvasHeight)
        position.up = position.up + velocity
        break
    }
  })
}

function testDrawTriangle () {

  // TODO: Fix this to use vec4 and not vec3
  //       add build buffers
  /*
        var vertices = [v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, v3.x, v3.y, v3.z]
      */
     
  var uniforms = [ {name: 'uModelViewMatrix', matrix: buildModelView()}, {name: 'uProjectionMatrix',matrix: buildProjection()} ]

  drawTriangle(
    resources.vertexShaders.defaultVertexShader,
    resources.fragShaders.defaultShader,
    buffers,
    uniforms
  )

}

function drawTriangle (vertexShader, fragShader, buffers, uniforms) {
  var shaders = [
    loadShader(gl.VERTEX_SHADER, vertexShader),
    loadShader(gl.FRAGMENT_SHADER, fragShader)
  ]
  attachShaders(shaders, buffers, uniforms)
  // Draw the triangle
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
}

function buildProjection () {
  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (45 * Math.PI) / 180 // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 0.1
  const zFar = 100.0
  const projectionMatrix = glMatrix.mat4.create()

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  glMatrix.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

  return projectionMatrix
}

function buildModelView () {
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = glMatrix.mat4.create()

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  glMatrix.mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [position.right - position.left, position.up - position.down, -6.0]
  ) // amount to translate
  return modelViewMatrix
}

function executeDrawSquare () {
  var vertexData = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]
  var params = [createParams('aVertexPosition', 2)]
  var vertexBuffer = buildBuffer(params, vertexData)

  var colorData = [
    1.0, 1.0, 1.0, 1.0, // white
    1.0, 0.0, 0.0, 1.0, // Red
    0.0, 1.0, 0.0, 1.0, // Green
    0.0, 0.0, 1.0, 1.0 // Blue
  ]
  params = [createParams('aVertexColor')]
  var colorBuffer = buildBuffer(params, colorData)

  // Can add more attributes
  var buffers = [vertexBuffer, colorBuffer]

  var uniforms = [ {name: 'uModelViewMatrix', matrix: buildModelView()}, {name: 'uProjectionMatrix',matrix: buildProjection()} ]

  drawSquare(
    resources.vertexShaders.defaultVertexShader,
    resources.fragShaders.defaultShader,
    buffers,
    uniforms
  )
}

function drawSquare (vertexShader, fragShader, buffers, uniforms) {
  var shaders = [
    loadShader(gl.VERTEX_SHADER, vertexShader),
    loadShader(gl.FRAGMENT_SHADER, fragShader)
  ]
  attachShaders(shaders, buffers, uniforms)

  const offset = 0
  const vertexCount = 4
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
}

function drawCube (vertexShader, fragShader, boxIndicesLength, buffers, uniforms) {
  var shaders = [
    loadShader(gl.VERTEX_SHADER, vertexShader),
    loadShader(gl.FRAGMENT_SHADER, fragShader)
  ]

  attachShaders(shaders, buffers, uniforms)

  gl.drawElements(gl.TRIANGLES, boxIndicesLength, gl.UNSIGNED_SHORT, 0);
}

function executeDrawCube(){
  
  var vertexData = 
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
  ];
  
  var params = [createParams('aVertexPosition', 3, gl.ARRAY_BUFFER, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0), 
                  createParams('aVertexColor', 3, gl.ARRAY_BUFFER, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT)]
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

  drawCube(
    resources.vertexShaders.defaultVertexShader,
    resources.fragShaders.defaultShader,
    boxIndices.length,
    buffers,
    uniforms
  )

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
          if (j < 1){
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

  for (var i = 0; i < uniforms.length; ++i){
    // attach uniforms
    var uniformLocation = gl.getUniformLocation(
      shaderProgram,
      uniforms[i].name
    )

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
        var path = resourceList[i - 1]
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

function main () {
  var backgroundColor = [0.0, 0.0, 0.0, 1.0]

  initializeWebGL()
  // for consistent call rate on keypress, call only millisecond
  setInterval(processUserInputs(), 1)
  calculateFramesPerSecond(null, function (err, framesPerSecond) {
    console.log(framesPerSecond + ' Frames Per Second')
  })

  loadShaderResources(vertexShaderPaths, fragShaderPaths)

  var loop = function () {
    // TODO: Move this out of the loop
    if (resources.length == vertexShaderPaths.length + fragShaderPaths.length) {
      clearCanvas(backgroundColor)

      // testDrawTriangle()
      // executeDrawSquare()
      executeDrawCube()

      frames++
    }

    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}

// const vertexShaderSource = `
//   attribute vec2 position;
//   varying vec2 v_coord;

//   void main() {
//     gl_Position = vec4(position, 0, 1);
//     v_coord = gl_Position.xy * 0.5 + 0.5;
//   }
// `;

// const fragmentShaderSource = `
// 	precision mediump float;
//   varying vec2 v_coord;
//   uniform sampler2D u_texture;
  
//   void main() {
//   	vec4 sampleColor = texture2D(u_texture, vec2(v_coord.x, 1.0 - v_coord.y));
//     gl_FragColor = sampleColor;
// 	}
// `;

// const texture = gl.createTexture();
// texture.image = new Image();
// texture.image.onload = function() {
//   handleLoadedTexture(gl, texture);
// };
// texture.image.crossOrigin = '';
// texture.image.src = 'image link';


// function handleLoadedTexture(gl, texture, callback) {
//   gl.bindTexture(gl.TEXTURE_2D, texture);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
//   gl.drawArrays(gl.TRIANGLES, 0, 6);
// }

