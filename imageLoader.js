// const vertexShaderSource = `
//   attribute vec2 position;
//   varying vec2 v_coord;

//   void main() {
//     gl_Position = vec4(position, 0, 1);
//     v_coord = gl_Position.xy * 0.5 + 0.5;
//   }
// `;

// const fragmentShaderSource = `
// 	precision mediump float;
//   varying vec2 v_coord;
//   uniform sampler2D u_texture;
  
//   void main() {
//   	vec4 sampleColor = texture2D(u_texture, vec2(v_coord.x, 1.0 - v_coord.y));
//     gl_FragColor = sampleColor;
// 	}
// `;

// const positionAttributeLocation = gl.getAttribLocation(program, 'position');

// const positionBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// gl.useProgram(program);
// gl.enableVertexAttribArray(positionAttributeLocation);

// // gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
// gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// // gl.STATIC_DRAW tells WebGL that the data are not likely to change.
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
// 	-1, -1, -1, 1, 1, -1,
//   1, 1, 1, -1, -1, 1,
// ]), gl.STATIC_DRAW);

// const texture = gl.createTexture();
// texture.image = new Image();
// texture.image.onload = function() {
//   handleLoadedTexture(gl, texture);
// };
// texture.image.crossOrigin = '';
// texture.image.src = 'http://davidguan.me/webgl-intro/filter/github.jpg';


// function handleLoadedTexture(gl, texture) {
//   gl.bindTexture(gl.TEXTURE_2D, texture);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
//   gl.drawArrays(gl.TRIANGLES, 0, 6);
// }