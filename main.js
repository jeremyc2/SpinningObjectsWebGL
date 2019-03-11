var gl
var frames
var resources = {}
var keyboardControls = { up: 0, down: 0, left: 0, right: 0 }
var velocity = 0.01 // 0.00003

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
  //   $(document).keydown(function (e) {
  //     switch (e.keyCode) {
  //       case 65: // left (a)
  //         keyboardControls.left = keyboardControls.left + velocity
  //         break
  //       case 68: // right (d)
  //         keyboardControls.right = keyboardControls.right + velocity
  //         break
  //       case 83: // down (s)
  //         keyboardControls.down = keyboardControls.down + velocity
  //         break
  //       case 87: // up (w)
  //         keyboardControls.up = keyboardControls.up + velocity
  //         break
  //     }
  //   })
  window.addEventListener('keydown', event => {
    console.log(event.key)
    switch (event.key) {
      case 'a': // left (a)
        keyboardControls.left = keyboardControls.left + velocity
        break

      case 'd': // right (d)
        keyboardControls.right = keyboardControls.right + velocity
        break

      case 's': // down (s)
        keyboardControls.down = keyboardControls.down + velocity
        break

      case 'w': // up (w)
        keyboardControls.up = keyboardControls.up + velocity
        break
    }
  })
}

function drawTriangle (vertices, vertexShader, attributes) {
  var indices = [0, 1, 2]
  var buffers = bindBuffers(vertices, indices)
  var fragShader = FragShader('frag', attributes)
  var shaders = [VertexShader(vertexShader), fragShader]
  attachShaders(shaders, buffers)
  // Draw the triangle
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
}
function bindBuffers (vertices, indices) {
  // Create an empty buffer object to store vertex buffer
  var vertex_buffer = gl.createBuffer()

  // Bind appropriate array buffer to it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer)

  // Pass the vertex data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  // Unbind the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  // Create an empty buffer object to store Index buffer
  var Index_Buffer = gl.createBuffer()

  // Bind appropriate array buffer to it
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer)

  // Pass the vertex data to the buffer
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  )

  // Unbind the buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

  var buffers = [vertex_buffer, Index_Buffer]

  return buffers
}
function VertexShader (vertCode) {
  // Create a vertex shader object
  var vertShader = gl.createShader(gl.VERTEX_SHADER)

  // Attach vertex shader source code
  gl.shaderSource(vertShader, vertCode)

  // Compile the vertex shader
  gl.compileShader(vertShader)
  return vertShader
}
function FragShader (type, attributes) {
  if (type == 'frag') {
    // fragment shader source code
    var fragCode =
      'void main(void) {' + ' gl_FragColor = vec4' + attributes[0] + ';}'

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER)

    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode)

    // Compile the fragmentt shader
    gl.compileShader(fragShader)
  }
  return fragShader
}
function attachShaders (shaders, buffers) {
  // the combined shader program
  var shaderProgram = gl.createProgram()

  var shaderLength = shaders.length
  for (var i = 0; i < shaderLength; ++i) {
    gl.attachShader(shaderProgram, shaders[i])
  }
  // Link both the programs
  gl.linkProgram(shaderProgram)

  // Use the combined shader program object
  gl.useProgram(shaderProgram)

  // Bind vertex buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0])

  // Bind index buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers[1])
  /* ======= Associating shaders to buffer objects ======= */

  // Get the attribute location
  var coord = gl.getAttribLocation(shaderProgram, 'coordinates')

  // Point an attribute to the currently bound VBO
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0)

  // Enable the attribute
  gl.enableVertexAttribArray(coord)
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

function loadShaderResources (shaderResources) {
  for (i = 0, len = shaderResources.length; i < len; i++) {
    loadTextResource(shaderResources[i], function (err, text) {
      if (err) {
        console.log(err)
      } else {
        var finalLength = resources.shaders.length
        resources.shaders.length = finalLength + 1
        var path = shaderResources[i - 1]
        resources.shaders[
          path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
        ] = text
      }
    })
  }
}

function translate (vertices, x, y, z) {
  var i = 0
  while (i < vertices.length - 1) {
    vertices[i] += x
    vertices[i + 1] += y
    vertices[i + 2] += z
    i++
    i++
    i++
  }
  // console.log((vertices.length - 1)/3)
}
function testDrawTriangle () {
  /*
      var vertices = [v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, v3.x, v3.y, v3.z]
    */
  var vertices = [-0.5, 0.5, 0.0, -0.5, -0.5, 0.5, 0.5, 0.5, 1.0]
  translate(
    vertices,
    keyboardControls.right - keyboardControls.left,
    keyboardControls.up - keyboardControls.down,
    0
  )
  var attributes = ['(1.0, 0.0, 0.0, 1.0)']
  drawTriangle(vertices, resources.shaders.defaultVertexShader, attributes)
  var vertices = [-0.5, -0.5, 0.0, 0.5, 0.5, 0.5, 0.5, -0.5, 1.0]
  translate(
    vertices,
    keyboardControls.right - keyboardControls.left,
    keyboardControls.up - keyboardControls.down,
    0
  )
  attributes = ['(0.0, 0.0, 1.0, 1.0)']
  drawTriangle(vertices, resources.shaders.defaultVertexShader, attributes)
}

function main () {
  var backgroundColor = [0.0, 0.0, 0.0, 1.0]

  shaderResourceList = ['shaders/defaultVertexShader.glsl']

  initializeWebGL()
  processUserInputs()
  calculateFramesPerSecond(null, function (err, framesPerSecond) {
    console.log(framesPerSecond + ' Frames Per Second')
  })

  resources['shaders'] = { length: 0 }
  loadShaderResources(shaderResourceList)

  var loop = function () {
    if (resources.shaders.length == shaderResourceList.length) {
      processUserInputs()

      clearCanvas(backgroundColor)

      testDrawTriangle()

      frames++
    }

    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}
