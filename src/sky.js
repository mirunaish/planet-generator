// simple shader that draws a blue gradient on a sphere around the camera
skyVertexSource = `
attribute vec3 Position;
varying vec3 vPosition;

uniform mat4 ModelViewProjection;
uniform mat4 Model;

void main() {
  gl_Position = ModelViewProjection * vec4(Position, 1.0);
  vPosition = (Model * vec4(Position, 1)).xyz;
}
`;
skyFragmentSource = `
precision mediump float;

varying vec3 vPosition;

void main() {
  float height = vPosition.y * 0.5 + 0.5;
  vec3 blue1 = vec3(${COLORS.sky[0].r}, ${COLORS.sky[0].g}, ${COLORS.sky[0].b});
  vec3 blue2 = vec3(${COLORS.sky[1].r}, ${COLORS.sky[1].g}, ${COLORS.sky[1].b});
  // interp between blue1 and blue2 based on y coord (lower values -> blue1)
  vec3 blue = mix(blue1, blue2, height);
  
  gl_FragColor = vec4(blue, 1.0);
}
`;

class Sky {
  constructor() {
    this.shaderProgram = createShaderProgram(
      gl,
      skyVertexSource,
      skyFragmentSource
    );

    this.generate();
  }

  generate() {
    // create a sphere centered at the origin
    const { vertices, faces } = sphere({ x: 0, y: 0, z: 0 }, 1, 5);
    this.triangles = faces.length;

    // convert array of vertices to array of positions (coords)
    const positions = [];
    for (var i = 0; i < vertices.length; ++i) {
      positions.push(vertices[i].x, vertices[i].y, vertices[i].z);
    }
    this.positionVbo = createVertexBuffer(gl, positions);

    // faces
    const indices = [];
    for (var i = 0; i < faces.length; ++i) {
      // then for every vertex in the face
      for (var j = 0; j < faces[i].length - 2; ++j) {
        // we push each vertex into index list
        indices.push(faces[i][0], faces[i][j + 1], faces[i][j + 2]);
      }
    }
    this.indexIbo = createIndexBuffer(gl, indices);
    this.indexCount = indices.length;
  }

  render({ model, viewNoTranslation, projection }) {
    gl.useProgram(this.shaderProgram);

    // vertex positions
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionVbo);
    const positionAttrib = gl.getAttribLocation(this.shaderProgram, "Position");
    gl.enableVertexAttribArray(positionAttrib);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);

    // faces
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexIbo);

    // add model view projection
    // use viewNoTranslation to keep the sky centered at the camera
    const modelViewProjection = projection
      .multiply(viewNoTranslation)
      .multiply(model);

    gl.uniformMatrix4fv(
      gl.getUniformLocation(this.shaderProgram, "ModelViewProjection"),
      false,
      modelViewProjection.transpose().m
    );
    gl.uniformMatrix4fv(
      gl.getUniformLocation(this.shaderProgram, "Model"),
      false,
      model.transpose().m
    );

    // disable depth testing so background isn't counted
    gl.disable(gl.DEPTH_TEST);

    // draw the sphere
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }
}
