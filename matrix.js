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
  // glMatrix.mat4.rotate()
  glMatrix.mat4.rotateX(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    rotate.x
  ) // amount to translate
  glMatrix.mat4.rotateY(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    rotate.y
  ) // amount to translate
  glMatrix.mat4.rotateZ(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    rotate.z
  ) // amount to translate
  var scaleArray = [scale, scale, scale]
  //scale4x4(modelViewMatrix, scaleArray)
    glMatrix.mat4.scale(modelViewMatrix, modelViewMatrix, scaleArray)
  return modelViewMatrix
}

