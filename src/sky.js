// simple shader that draws a blue gradient on a sphere around the camera
skyVertexSource = `
attribute vec3 Position;
attribute float White;

varying vec3 vPosition;
varying float vWhite;

uniform mat4 uModelViewProjection;
uniform mat4 uModel;

void main() {
  gl_Position = uModelViewProjection * vec4(Position, 1.0);
  vPosition = (uModel * vec4(Position, 1)).xyz;
  vWhite = White;
}
`;
skyFragmentSource = `
precision mediump float;

varying vec3 vPosition;
varying float vWhite;

void main() {
  float height = vPosition.y * 0.5 + 0.5;
  vec3 blue1 = vec3(${COLORS.sky[0].r}, ${COLORS.sky[0].g}, ${COLORS.sky[0].b});
  vec3 blue2 = vec3(${COLORS.sky[1].r}, ${COLORS.sky[1].g}, ${COLORS.sky[1].b});
  // interp between blue1 and blue2 based on y coord (lower values -> blue1)
  vec3 blue = mix(blue1, blue2, height);

  float white = vWhite;

  // interp between blue and white based on white
  gl_FragColor = vec4(mix(blue, vec3(1.0), white), 1.0);
  return;
  
  gl_FragColor = vec4(blue, 1.0);
}
`;

console.log("starting cloud worker");
const cloudWorker = new Worker("src/webWorkers/generateWorker.js");
cloudWorker.onerror = function (error) {
  console.error("cloud worker error:", error);
};

class Sky {
  constructor() {
    this.name = "sky";

    this.shaderProgram = createShaderProgram(
      gl,
      skyVertexSource,
      skyFragmentSource
    );

    this.done = false;

    this.subscribeToWorker();
    this.generate();
  }

  /** once texture etc have been generated, do webgl stuff */
  updateMesh({ vertices, faces, white }) {
    this.vertices = vertices;
    this.faces = faces;
    this.white = white;

    // convert array of vertices to array of positions (coords)
    const positions = this.vertices.flatMap((v) => [v.x, v.y, v.z]);
    this.positionVbo = createVertexBuffer(gl, [...positions]);

    // faces
    const indices = this.faces.flatMap((f) => [f[0], f[1], f[2]]);
    this.indexIbo = createIndexBuffer(gl, [...indices]);
    this.indexCount = indices.length;

    // colors
    this.whiteVbo = createVertexBuffer(gl, this.white);

    this.done = true;
  }

  subscribeToWorker() {
    const callback = (e) => {
      const { caller, result } = e.data;

      if (caller !== this.name) return; // not for me

      // create a mesh from data given to me by worker
      this.updateMesh(result);
    };

    // when worker responds with data, update my stuff
    cloudWorker.addEventListener("message", callback);
  }

  generate() {
    // create a sphere centered at the origin
    cloudWorker.postMessage({
      type: "cloud",
      caller: this.name,
    });
  }

  attachVariablesToShader(modelViewProjection, model) {
    // vertex positions
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionVbo);
    const positionAttrib = gl.getAttribLocation(this.shaderProgram, "Position");
    gl.enableVertexAttribArray(positionAttrib);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);

    // colors
    gl.bindBuffer(gl.ARRAY_BUFFER, this.whiteVbo);
    const whiteAttrib = gl.getAttribLocation(this.shaderProgram, "White");
    gl.enableVertexAttribArray(whiteAttrib);
    gl.vertexAttribPointer(whiteAttrib, 1, gl.FLOAT, false, 0, 0);

    // faces
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexIbo);

    // add model view projection
    gl.uniformMatrix4fv(
      gl.getUniformLocation(this.shaderProgram, "uModelViewProjection"),
      false,
      modelViewProjection.transpose().m
    );
    gl.uniformMatrix4fv(
      gl.getUniformLocation(this.shaderProgram, "uModel"),
      false,
      model.transpose().m
    );
  }

  render({ model, viewNoTranslation, projection }) {
    if (!this.done) return;

    gl.useProgram(this.shaderProgram);

    // use viewNoTranslation to keep the sky centered at the camera
    const modelViewProjection = projection
      .multiply(viewNoTranslation)
      .multiply(model);

    this.attachVariablesToShader(modelViewProjection, model);

    // disable depth testing so background isn't counted
    gl.disable(gl.DEPTH_TEST);

    // draw the sphere
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }
}
