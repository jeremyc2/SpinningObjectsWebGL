precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aVertexTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 aFragTexCoord;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    aFragTexCoord = aVertexTexCoord;
}