function testDrawTriangle () {
  // TODO: Fix this to use vec4 and not vec3
  //       add build buffers
  /*
          var vertices = [v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, v3.x, v3.y, v3.z]
        */

  var uniforms = [
    { name: 'uModelViewMatrix', matrix: buildModelView() },
    { name: 'uProjectionMatrix', matrix: buildProjection() }
  ]

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

function executeDrawSquare () {
  var vertexData = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]
  var params = [createParams('aVertexPosition', 2)]
  var vertexBuffer = buildBuffer(params, vertexData)

  var colorData = [
    1.0,
    1.0,
    1.0,
    1.0, // white
    1.0,
    0.0,
    0.0,
    1.0, // Red
    0.0,
    1.0,
    0.0,
    1.0, // Green
    0.0,
    0.0,
    1.0,
    1.0 // Blue
  ]
  params = [createParams('aVertexColor')]
  var colorBuffer = buildBuffer(params, colorData)

  // Can add more attributes
  var buffers = [vertexBuffer, colorBuffer]

  var uniforms = [
    { name: 'uModelViewMatrix', matrix: buildModelView() },
    { name: 'uProjectionMatrix', matrix: buildProjection() }
  ]

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

function drawCube (
  vertexShader,
  fragShader,
  boxIndicesLength,
  buffers,
  uniforms
) {
  var shaders = [
    loadShader(gl.VERTEX_SHADER, vertexShader),
    loadShader(gl.FRAGMENT_SHADER, fragShader)
  ]

  attachShaders(shaders, buffers, uniforms)

  gl.drawElements(gl.TRIANGLES, boxIndicesLength, gl.UNSIGNED_SHORT, 0)
}

function executeDrawCube () {
  var vertexData = [
    // X, Y, Z           R, G, B
    // Top
    -1.0,
    1.0,
    -1.0,
    0.5,
    0.5,
    0.5,
    -1.0,
    1.0,
    1.0,
    0.5,
    0.5,
    0.5,
    1.0,
    1.0,
    1.0,
    0.5,
    0.5,
    0.5,
    1.0,
    1.0,
    -1.0,
    0.5,
    0.5,
    0.5,

    // Left
    -1.0,
    1.0,
    1.0,
    0.75,
    0.25,
    0.5,
    -1.0,
    -1.0,
    1.0,
    0.75,
    0.25,
    0.5,
    -1.0,
    -1.0,
    -1.0,
    0.75,
    0.25,
    0.5,
    -1.0,
    1.0,
    -1.0,
    0.75,
    0.25,
    0.5,

    // Right
    1.0,
    1.0,
    1.0,
    0.25,
    0.25,
    0.75,
    1.0,
    -1.0,
    1.0,
    0.25,
    0.25,
    0.75,
    1.0,
    -1.0,
    -1.0,
    0.25,
    0.25,
    0.75,
    1.0,
    1.0,
    -1.0,
    0.25,
    0.25,
    0.75,

    // Front
    1.0,
    1.0,
    1.0,
    1.0,
    0.0,
    0.15,
    1.0,
    -1.0,
    1.0,
    1.0,
    0.0,
    0.15,
    -1.0,
    -1.0,
    1.0,
    1.0,
    0.0,
    0.15,
    -1.0,
    1.0,
    1.0,
    1.0,
    0.0,
    0.15,

    // Back
    1.0,
    1.0,
    -1.0,
    0.0,
    1.0,
    0.15,
    1.0,
    -1.0,
    -1.0,
    0.0,
    1.0,
    0.15,
    -1.0,
    -1.0,
    -1.0,
    0.0,
    1.0,
    0.15,
    -1.0,
    1.0,
    -1.0,
    0.0,
    1.0,
    0.15,

    // Bottom
    -1.0,
    -1.0,
    -1.0,
    0.5,
    0.5,
    1.0,
    -1.0,
    -1.0,
    1.0,
    0.5,
    0.5,
    1.0,
    1.0,
    -1.0,
    1.0,
    0.5,
    0.5,
    1.0,
    1.0,
    -1.0,
    -1.0,
    0.5,
    0.5,
    1.0
  ]

  var params = [
    createParams(
      'aVertexPosition',
      3,
      gl.ARRAY_BUFFER,
      gl.FLOAT,
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT,
      0
    ),
    createParams(
      'aVertexColor',
      3,
      gl.ARRAY_BUFFER,
      gl.FLOAT,
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT,
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

  drawCube(
    resources.vertexShaders.defaultVertexShader,
    resources.fragShaders.defaultShader,
    boxIndices.length,
    buffers,
    uniforms
  )
}

function executeDrawPlus () {
  var vertexData = [
    [
      // X, Y, Z           R, G, B
      // Top
      -2.0,
      1.0,
      -1.0,
      0.5,
      0.5,
      0.5,
      -2.0,
      1.0,
      1.0,
      0.5,
      0.5,
      0.5,
      0.0,
      1.0,
      1.0,
      0.5,
      0.5,
      0.5,
      0.0,
      1.0,
      -1.0,
      0.5,
      0.5,
      0.5,

      // Left
      -2.0,
      1.0,
      1.0,
      0.75,
      0.25,
      0.5,
      -2.0,
      -1.0,
      1.0,
      0.75,
      0.25,
      0.5,
      -2.0,
      -1.0,
      -1.0,
      0.75,
      0.25,
      0.5,
      -2.0,
      1.0,
      -1.0,
      0.75,
      0.25,
      0.5,

      // Right
      0.0,
      1.0,
      1.0,
      0.25,
      0.25,
      0.75,
      0.0,
      -1.0,
      1.0,
      0.25,
      0.25,
      0.75,
      0.0,
      -1.0,
      -1.0,
      0.25,
      0.25,
      0.75,
      0.0,
      1.0,
      -1.0,
      0.25,
      0.25,
      0.75,

      // Front
      0.0, // x
      1.0,
      1.0,
      1.0, // c
      0.0,
      0.15,
      0.0, // x
      -1.0,
      1.0,
      1.0, // c
      0.0,
      0.15,
      -2.0, // x
      -1.0,
      1.0,
      1.0, // c
      0.0,
      0.15,
      -2.0, // x
      1.0,
      1.0,
      1.0, // c
      0.0,
      0.15,

      // Back
      0.0,
      1.0,
      -1.0,
      0.0,
      1.0,
      0.15,
      0.0,
      -1.0,
      -1.0,
      0.0,
      1.0,
      0.15,
      -2.0,
      -1.0,
      -1.0,
      0.0,
      1.0,
      0.15,
      -2.0,
      1.0,
      -1.0,
      0.0,
      1.0,
      0.15,

      // Bottom
      -2.0,
      -1.0,
      -1.0,
      0.5,
      0.5,
      1.0,
      -2.0,
      -1.0,
      1.0,
      0.5,
      0.5,
      1.0,
      0.0,
      -1.0,
      1.0,
      0.5,
      0.5,
      1.0,
      0.0,
      -1.0,
      -1.0,
      0.5,
      0.5,
      1.0
    ],
    [
      // X, Y, Z           R, G, B
      // Top
      0.0,
      1.0,
      -1.0,
      0.5,
      0.5,
      0.5,
      0.0,
      1.0,
      1.0,
      0.5,
      0.5,
      0.5,
      2.0,
      1.0,
      1.0,
      0.5,
      0.5,
      0.5,
      2.0,
      1.0,
      -1.0,
      0.5,
      0.5,
      0.5,

      // Left
      0.0,
      1.0,
      1.0,
      0.75,
      0.25,
      0.5,
      0.0,
      -1.0,
      1.0,
      0.75,
      0.25,
      0.5,
      0.0,
      -1.0,
      -1.0,
      0.75,
      0.25,
      0.5,
      0.0,
      1.0,
      -1.0,
      0.75,
      0.25,
      0.5,

      // Right
      2.0,
      1.0,
      1.0,
      0.25,
      0.25,
      0.75,
      2.0,
      -1.0,
      1.0,
      0.25,
      0.25,
      0.75,
      2.0,
      -1.0,
      -1.0,
      0.25,
      0.25,
      0.75,
      2.0,
      1.0,
      -1.0,
      0.25,
      0.25,
      0.75,

      // Front
      2.0,
      1.0,
      1.0,
      1.0,
      0.0,
      0.15,
      2.0,
      -1.0,
      1.0,
      1.0,
      0.0,
      0.15,
      0.0,
      -1.0,
      1.0,
      1.0,
      0.0,
      0.15,
      0.0,
      1.0,
      1.0,
      1.0,
      0.0,
      0.15,

      // Back
      2.0,
      1.0,
      -1.0,
      0.0,
      1.0,
      0.15,
      2.0,
      -1.0,
      -1.0,
      0.0,
      1.0,
      0.15,
      0.0,
      -1.0,
      -1.0,
      0.0,
      1.0,
      0.15,
      0.0,
      1.0,
      -1.0,
      0.0,
      1.0,
      0.15,

      // Bottom
      0.0,
      -1.0,
      -1.0,
      0.5,
      0.5,
      1.0,
      0.0,
      -1.0,
      1.0,
      0.5,
      0.5,
      1.0,
      2.0,
      -1.0,
      1.0,
      0.5,
      0.5,
      1.0,
      2.0,
      -1.0,
      -1.0,
      0.5,
      0.5,
      1.0
    ],
    [
      // X, Y, Z           R, G, B
      // Top
      -1.0,
      2.0,
      -1.0,
      0.5,
      0.5,
      0.5,
      -1.0,
      2.0,
      1.0,
      0.5,
      0.5,
      0.5,
      1.0,
      2.0,
      1.0,
      0.5,
      0.5,
      0.5,
      1.0,
      2.0,
      -1.0,
      0.5,
      0.5,
      0.5,

      // Left
      -1.0,
      2.0,
      1.0,
      0.75,
      0.25,
      0.5,
      -1.0,
      0.0,
      1.0,
      0.75,
      0.25,
      0.5,
      -1.0,
      0.0,
      -1.0,
      0.75,
      0.25,
      0.5,
      -1.0,
      2.0,
      -1.0,
      0.75,
      0.25,
      0.5,

      // Right
      1.0,
      2.0,
      1.0,
      0.25,
      0.25,
      0.75,
      1.0,
      0.0,
      1.0,
      0.25,
      0.25,
      0.75,
      1.0,
      0.0,
      -1.0,
      0.25,
      0.25,
      0.75,
      1.0,
      2.0,
      -1.0,
      0.25,
      0.25,
      0.75,

      // Front
      1.0,
      2.0,
      1.0,
      1.0,
      0.0,
      0.15,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      0.15,
      -1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      0.15,
      -1.0,
      2.0,
      1.0,
      1.0,
      0.0,
      0.15,

      // Back jk
      1.0,
      2.0,
      -1.0,
      0.0,
      1.0,
      0.15,
      1.0,
      0.0,
      -1.0,
      0.0,
      1.0,
      0.15,
      -1.0,
      0.0,
      -1.0,
      0.0,
      1.0,
      0.15,
      -1.0,
      2.0,
      -1.0,
      0.0,
      1.0,
      0.15,

      // Bottom
      -1.0,
      0.0,
      -1.0,
      0.5,
      0.5,
      1.0,
      -1.0,
      0.0,
      1.0,
      0.5,
      0.5,
      1.0,
      1.0,
      0.0,
      1.0,
      0.5,
      0.5,
      1.0,
      1.0,
      0.0,
      -1.0,
      0.5,
      0.5,
      1.0
    ],
    [
      // X, Y, Z           R, G, B
      // Top
      -1.0,
      -1.0,
      -1.0,
      0.5,
      0.5,
      0.5,
      -1.0,
      0.0,
      1.0,
      0.5,
      0.5,
      0.5,
      1.0,
      0.0,
      1.0,
      0.5,
      0.5,
      0.5,
      1.0,
      0.0,
      -1.0,
      0.5,
      0.5,
      0.5,

      // Left
      -1.0,
      0.0,
      1.0,
      0.75,
      0.25,
      0.5,
      -1.0,
      -2.0,
      1.0,
      0.75,
      0.25,
      0.5,
      -1.0,
      -2.0,
      -1.0,
      0.75,
      0.25,
      0.5,
      -1.0,
      0.0,
      -1.0,
      0.75,
      0.25,
      0.5,

      // Right
      1.0,
      0.0,
      1.0,
      0.25,
      0.25,
      0.75,
      1.0,
      -2.0,
      1.0,
      0.25,
      0.25,
      0.75,
      1.0,
      -2.0,
      -1.0,
      0.25,
      0.25,
      0.75,
      1.0,
      0.0,
      -1.0,
      0.25,
      0.25,
      0.75,

      // Front
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      0.15,
      1.0,
      -2.0,
      1.0,
      1.0,
      0.0,
      0.15,
      -1.0,
      -2.0,
      1.0,
      1.0,
      0.0,
      0.15,
      -1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      0.15,

      // Back
      1.0,
      0.0,
      -1.0,
      0.0,
      1.0,
      0.15,
      1.0,
      -2.0,
      -1.0,
      0.0,
      1.0,
      0.15,
      -1.0,
      -2.0,
      -1.0,
      0.0,
      1.0,
      0.15,
      -1.0,
      0.0,
      -1.0,
      0.0,
      1.0,
      0.15,

      // Bottom
      -1.0,
      -2.0,
      -1.0,
      0.5,
      0.5,
      1.0,
      -1.0,
      -2.0,
      1.0,
      0.5,
      0.5,
      1.0,
      1.0,
      -2.0,
      1.0,
      0.5,
      0.5,
      1.0,
      1.0,
      -2.0,
      -1.0,
      0.5,
      0.5,
      1.0
    ]
  ]

  for (var i = 0; i < 4; i++) {
    var params = [
      createParams(
        'aVertexPosition',
        3,
        gl.ARRAY_BUFFER,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0
      ),
      createParams(
        'aVertexColor',
        3,
        gl.ARRAY_BUFFER,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
      )
    ]
    var vertexBuffer = buildBuffer(params, vertexData[i])

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

    drawCube(
      resources.vertexShaders.defaultVertexShader,
      resources.fragShaders.defaultShader,
      boxIndices.length,
      buffers,
      uniforms
    )
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

  bindTexture(resources.images.boxSide)

  drawCube(
    resources.vertexShaders.imageVertShader,
    resources.fragShaders.imageFragShader,
    boxIndices.length,
    buffers,
    uniforms
  )
}

function executeDrawRubiksCube () {
  /*
    "The, dare I say, best solution is to put all of the images in 
    1 texture and use texture coordinates to map a different part 
    of the texture to each face of the cube. This is the technique 
    that pretty much all high performance apps (read games) use.""
        https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
  */ 
  var vertexData = 
	[ // X, Y, Z           U, V
		// Top
		-1.0, 1.0, -1.0,   0, 0,
		-1.0, 1.0, 1.0,    0, .5,
		1.0, 1.0, 1.0,     .33, .5,
		1.0, 1.0, -1.0,    .33, 0,

		// Left
		-1.0, 1.0, 1.0,    .33, 0,
		-1.0, -1.0, 1.0,   .33, .5,
		-1.0, -1.0, -1.0,  .66, .5,
		-1.0, 1.0, -1.0,   .66, 0,

		// Right
		1.0, 1.0, 1.0,    .66, 0,
		1.0, -1.0, 1.0,   .66, .5,
		1.0, -1.0, -1.0,  1, .5,
		1.0, 1.0, -1.0,   1, 0,

		// Front
		1.0, 1.0, 1.0,    0,.5,
		1.0, -1.0, 1.0,   0,1,
		-1.0, -1.0, 1.0,  .33,1,
		-1.0, 1.0, 1.0,   .33,.5,

		// Back
		1.0, 1.0, -1.0,    .33, .5,
		1.0, -1.0, -1.0,    .33, 1,
		-1.0, -1.0, -1.0,    .66, 1,
		-1.0, 1.0, -1.0,    .66, .5,

		// Bottom
		-1.0, -1.0, -1.0,   .66, .5,
		-1.0, -1.0, 1.0,    .66, 1,
		1.0, -1.0, 1.0,     1, 1,
		1.0, -1.0, -1.0,    1, .5,
	];

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

  bindTexture(resources.images.fullRubix)

  drawCube(
    resources.vertexShaders.imageVertShader,
    resources.fragShaders.imageFragShader,
    boxIndices.length,
    buffers,
    uniforms
  )
}

function executeDrawPyramid () {
  var vertexData = [
    // Front face
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    -1.0,
    -1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    -1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    // Front face

    // Right face
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    -1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    -1.0,
    -1.0,
    0.0,
    1.0,
    0.0,

    // Back face
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    -1.0,
    -1.0,
    0.0,
    1.0,
    0.0,
    -1.0,
    -1.0,
    -1.0,
    0.0,
    0.0,
    1.0,

    // Left face
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    -1.0,
    -1.0,
    -1.0,
    0.0,
    0.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    0.0,
    1.0,
    0.0,

    // Bottom
    -1.0,
    -1.0,
    -1.0,
    0.0,
    0.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    -1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    -1.0,
    -1.0,
    0.0,
    1.0,
    0.0
  ]

  var params = [
    createParams(
      'aVertexPosition',
      3,
      gl.ARRAY_BUFFER,
      gl.FLOAT,
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT,
      0
    ),
    createParams(
      'aVertexColor',
      3,
      gl.ARRAY_BUFFER,
      gl.FLOAT,
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT
    )
  ]
  var vertexBuffer = buildBuffer(params, vertexData)

  var boxIndices = [
    // Top
    0,
    1,
    2,

    // Left
    3,
    4,
    5,

    // Right
    6,
    7,
    8,

    // Front
    9,
    10,
    11,

    // Bottom
    13,
    12,
    14,
    14,
    12,
    15
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

  drawCube(
    resources.vertexShaders.defaultVertexShader,
    resources.fragShaders.defaultShader,
    boxIndices.length,
    buffers,
    uniforms
  )
}







function executeDrawSuzanne () {
  var vertexData = suzanne.meshes[0].vertices
  var params = [
    createParams(
      'aVertexPosition',
      3,
      gl.ARRAY_BUFFER,
      gl.FLOAT,
      gl.FALSE,
      3 * Float32Array.BYTES_PER_ELEMENT,
      0
    )
  ]
  var vertexBuffer = buildBuffer(params, vertexData)

  var textCoord = suzanne.meshes[0].texturecoords[0]
  params = [createParams(
    'aVertexTexCoord',
    2,
    gl.ARRAY_BUFFER,
    gl.FLOAT,
    gl.FALSE,
    2 * Float32Array.BYTES_PER_ELEMENT,
    0 * Float32Array.BYTES_PER_ELEMENT
  )]
  var textCoordBuffer = buildBuffer(params, textCoord)

  var boxIndices = [].concat.apply([], suzanne.meshes[0].faces)

  params = [createParams('indices', 6, gl.ELEMENT_ARRAY_BUFFER)]
  var indicesBuffer = buildBuffer(params, boxIndices)

  // Can add more attributes
  var buffers = [vertexBuffer, textCoordBuffer, indicesBuffer]

  // TODO: Change Me
  var uniforms = [
    { name: 'uModelViewMatrix', matrix: buildModelView() },
    { name: 'uProjectionMatrix', matrix: buildProjection() }
  ]

  bindTexture(resources.images.SusanTexture)

  drawCube(
    resources.vertexShaders.imageVertShader,
    resources.fragShaders.imageFragShader,
    boxIndices.length,
    buffers,
    uniforms
  )
}

function executeDrawTRex () {
  var vertexData = TRex.meshes[0].vertices
  var params = [
    createParams(
      'aVertexPosition',
      3,
      gl.ARRAY_BUFFER,
      gl.FLOAT,
      gl.FALSE,
      3 * Float32Array.BYTES_PER_ELEMENT,
      0
    )
  ]
  var vertexBuffer = buildBuffer(params, vertexData)

  var textCoord = TRex.meshes[0].texturecoords[0]
  params = [createParams(
    'aVertexTexCoord',
    2,
    gl.ARRAY_BUFFER,
    gl.FLOAT,
    gl.FALSE,
    2 * Float32Array.BYTES_PER_ELEMENT,
    0 * Float32Array.BYTES_PER_ELEMENT
  )]
  var textCoordBuffer = buildBuffer(params, textCoord)

  var boxIndices = [].concat.apply([], TRex.meshes[0].faces)

  params = [createParams('indices', 6, gl.ELEMENT_ARRAY_BUFFER)]
  var indicesBuffer = buildBuffer(params, boxIndices)

  // Can add more attributes
  var buffers = [vertexBuffer, textCoordBuffer, indicesBuffer]

  // TODO: Change Me
  var uniforms = [
    { name: 'uModelViewMatrix', matrix: buildModelView() },
    { name: 'uProjectionMatrix', matrix: buildProjection() }
  ]

  bindTexture(resources.images.Trex_Diffuse)

  drawCube(
    resources.vertexShaders.imageVertShader,
    resources.fragShaders.imageFragShader,
    boxIndices.length,
    buffers,
    uniforms
  )
}
