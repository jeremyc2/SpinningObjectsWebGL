precision mediump float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vColor;

void main(void) {
gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
vColor = aVertexColor;
}