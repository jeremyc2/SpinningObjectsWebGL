precision mediump float;

varying vec2 aFragTexCoord;
uniform sampler2D sampler;

void main(void) {
  gl_FragColor = texture2D(sampler, aFragTexCoord);
}