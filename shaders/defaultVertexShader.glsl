attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec3 vColor;

void main(void) {
gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
vColor = aVertexColor;
}

// precision mediump float; 

// attribute vec3 vertPosition; 
// attribute vec3 vertColor; 

// varying vec3 fragColor; 

// uniform mat4 mWorld; 
// uniform mat4 mView;
// uniform mat4 mProj;

// void main() { 
//     fragColor = vertColor; 
//     gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0); 
// }