var gl
var frames
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
  } else {
    console.log('WebGL not supported!')
  }
}

function processUserInputs () {
  $(document).keydown(function (e) {
    switch (e.keyCode) {
      case 65: // left (a)
        position.left = position.left + velocity
        break
      case 68: // right (d)
        position.right = position.right + velocity
        break
      case 83: // down (s)
        position.down = position.down + velocity
        break
      case 87: // up (w)
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

  var uniforms = { modelView: buildModelView(), projection: buildProjection() }

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
  var params = createParams('aVertexPosition', 2)
  var vertexBuffer = buildBuffer(params, vertexData)

  var colorData = [
    1.0, 1.0, 1.0, 1.0, // white
    1.0, 0.0, 0.0, 1.0, // Red
    0.0, 1.0, 0.0, 1.0, // Green
    0.0, 0.0, 1.0, 1.0 // Blue
  ]
  params = createParams('aVertexColor')
  var colorBuffer = buildBuffer(params, colorData)

  // Can add more attributes
  var buffers = [vertexBuffer, colorBuffer]

  var uniforms = { modelView: buildModelView(), projection: buildProjection() }

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

function buildBuffer (params, data) {
  // Create an empty buffer object to store vertex buffer
  const buffer = gl.createBuffer()

  // Bind appropriate array buffer to it
  gl.bindBuffer(params.arrayType, buffer)

  // Pass the data to the buffer
  if (params.type == gl.FLOAT) {
    gl.bufferData(params.arrayType, new Float32Array(data), gl.STATIC_DRAW)
  } else if (params.arrayType == gl.ELEMENT_ARRAY_BUFFER) {
    gl.bufferData(params.arrayType, new Uint16Array(data), gl.STATIC_DRAW)
  } else {
    alert('Buffer Type not Supported')
  }

  return {
    data: buffer,
    params: params
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
    var params = buffer.params
    if (params.arrayType != gl.ELEMENT_ARRAY_BUFFER) {
      var location = gl.getAttribLocation(shaderProgram, params.name)
      gl.bindBuffer(params.arrayType, buffer.data)
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

  // attach uniforms
  var modelViewLocation = gl.getUniformLocation(
    shaderProgram,
    'uModelViewMatrix'
  )
  var projectionLocation = gl.getUniformLocation(
    shaderProgram,
    'uProjectionMatrix'
  )

  gl.uniformMatrix4fv(projectionLocation, false, uniforms.projection)
  gl.uniformMatrix4fv(modelViewLocation, false, uniforms.modelView)
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
      executeDrawSquare()

      frames++
    }

    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}
