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
    gl.depthFunc(gl.LEQUAL) // Near things obscure far things
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

function clearCanvas (backgroundColor) {
  // Clear the canvas
  gl.clearColor(
    backgroundColor[0],
    backgroundColor[1],
    backgroundColor[2],
    backgroundColor[3]
  )
  gl.clearDepth(1.0) // Clear everything
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

function testDrawTriangle () {
  /*
      var vertices = [v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, v3.x, v3.y, v3.z]
    */
  //   var vertices = [-0.5, 0.5, 0.0, -0.5, -0.5, 0.5, 0.5, 0.5, 1.0]
}

function testRun () {
  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(
    resources.vertexShaders.defaultVertexShader,
    resources.fragShaders.defaultShader
  )

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        'uProjectionMatrix'
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
    }
  }

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers()

  // Draw the scene
  drawScene(programInfo, buffers)
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//
function initBuffers () {
  // Create a buffer for the square's positions.

  const positionBuffer = gl.createBuffer()

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // Now create an array of positions for the square.

  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  // Now set up the colors for the vertices

  var colors = [
    1.0,
    1.0,
    1.0,
    1.0, // white
    1.0,
    0.0,
    0.0,
    1.0, // red
    0.0,
    1.0,
    0.0,
    1.0, // green
    0.0,
    0.0,
    1.0,
    1.0 // blue
  ]

  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  return {
    position: positionBuffer,
    color: colorBuffer
  }
}

//
// Draw the scene.
//
function drawScene (programInfo, buffers) {
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

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 2
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)
  }

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program)

  // Set the shader uniforms

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  )
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  )

  const offset = 0
  const vertexCount = 4
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram (vsSource, fsSource) {
  const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource)

  // Create the shader program

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      'Unable to initialize the shader program: ' +
        gl.getProgramInfoLog(shaderProgram)
    )
    return null
  }

  return shaderProgram
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

      //   testDrawTriangle()
      testRun()

      frames++
    }

    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}
