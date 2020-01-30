var position = { up: 0, down: 0, left: 0, right: 0 }
var rotate = { x: 0, y: 0, z: 0 }
var scale = 1
var scaleVelocity = .03
var translateVelocity = 0.1
var rotateVelocity = 0.1
var canvasWidth = 4
var canvasHeight = 4
var buttons = { cubeButton: 0, squareButton: 0, plusButton: 0, imageCubeButton: 0, pyramidButton : 0, rubiksButton: 0, suzanneButton: 0, TRexButton: 0}

function buttonClick (id) {
  var buttonDOM = document.getElementById(id)
  if (buttons[id] == 0) {
    buttons[id] = 1
    buttonDOM.style.backgroundColor = 'blue'
    buttonDOM.style.color = 'white'
  } else {
    buttons[id] = 0
    buttonDOM.style.backgroundColor = 'white'
    buttonDOM.style.color = 'black'
  }
}

function movementControls (e) {
  switch (e.keyCode) {
    case 65: // left (a)
      if (position.left - position.right <= canvasWidth) {
        position.left = position.left + translateVelocity
      }
      break
    case 68: // right (d)
      if (position.left - position.right >= -canvasWidth) {
        position.right = position.right + translateVelocity
      }
      break
    case 83: // down (s)
      if (position.up - position.down >= -canvasHeight) {
        position.down = position.down + translateVelocity
      }
      break
    case 87: // up (w)
      if (position.up - position.down <= canvasHeight) {
        position.up = position.up + translateVelocity
      }
      break
  }
}

var drag = false;
var old_x, old_y;
var dX = 0, dY = 0;

var mouseDown = function(e) {
   drag = true;
   old_x = e.pageX || e.touches[0].pageX, old_y = e.pageY || e.touches[0].pageY;
   e.preventDefault();
   console.log("mouse down");
   return false;
};

var mouseUp = function(e){
   drag = false;
   console.log("mouse up");
};

var mouseMove = function(e) {
   if (!drag) return false;
   console.log("mouse move");
   dX = (e.pageX-old_x || e.touches[0].pageX-old_x)*2*Math.PI/canvas.width,
   dY = (e.pageY-old_y || e.touches[0].pageY-old_y)*2*Math.PI/canvas.height;
   rotate.y += dX;
   rotate.x += dY;
   old_x = e.pageX || e.touches[0].pageX, old_y = e.pageY || e.touches[0].pageY;
   e.preventDefault();
   console.log("dX=", dX, " dY=", dY, " e.pageX=", e.touches[0].pageX, " e.pageY=", e.touches[0].pageY);
};

function rotateControls (e) {
  switch (e.keyCode) {
    case 186: // (;)
      rotate.z -= rotateVelocity
      break
    case 73: // (i)
      rotate.x += rotateVelocity
      break
    case 75: // (k)
      rotate.x -= rotateVelocity
      break
    case 76: // (l)
      rotate.y -= rotateVelocity
      break
    case 79: // (o)
      rotate.y += rotateVelocity
      break
    case 80: // (p)
      rotate.z += rotateVelocity
      break
  }
}

function scaleControls (e) {
  switch (e.keyCode) {
    case 187: // (=)
    scale += scaleVelocity
    break
    case 189: // (-)
    scale -= scaleVelocity
    break
  }
}

function processUserInputs () {
  $(document).keydown(function (e) {
    movementControls(e)
  })
  $(document).keydown(function (e) {
    rotateControls(e)
  })
  $(document).keydown(function (e) {
    scaleControls(e)
  })
}
