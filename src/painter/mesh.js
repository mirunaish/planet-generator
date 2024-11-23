/** adapted from assignment 3 GLMesh.js and Mesh.js */

class Mesh {
  constructor(gl, vertices, faces, normals) {
    this.gl = gl;
    this.vertices = vertices;
    this.faces = faces;
    if (normals && normals.length) this.normals = normals;

    // create the shader program from the two source codes
    this.shaderProgram = createShaderProgram(
      this.gl,
      vertexSource,
      fragmentSource
    );

    this.toGLMesh();
  }

  // create a triangle mesh, optionally using vertex normals if they are specified
  toGLMesh() {
    var positions = [];

    // convert array of vertices to array of coords
    for (var i = 0; i < this.vertices.length; ++i) {
      positions.push(
        this.vertices[i].x,
        this.vertices[i].y,
        this.vertices[i].z
      );
    }

    var edgeIndices = [];
    var indices = [];

    // For every face
    for (var i = 0; i < this.faces.length; ++i) {
      // then for every vertex in the face
      for (var j = 0; j < this.faces[i].length - 2; ++j) {
        // we push each vertex into index list
        indices.push(
          this.faces[i][0],
          this.faces[i][j + 1],
          this.faces[i][j + 2]
        );
      }
      // the edge indices are used to draw the wireframe of the mesh
      for (
        var j = 0, k = this.faces[i].length - 1;
        j < this.faces[i].length;
        k = j, ++j
      )
        edgeIndices.push(this.faces[i][k], this.faces[i][j]);
    }

    var normals = [];
    if (this.normals) {
      // mesh contains vertex normals, just copy them
      for (var i = 0; i < this.normals.length; ++i) {
        var n = this.normals[i].unit();
        normals.push(n.x, n.y, n.z);
      }
    } else {
      // no vertex normals available, so compute them by averaging face normals

      // initialize averaged normals to zero
      var avgNormals = Array(this.vertices.length).fill(new Vector(0, 0, 0));

      for (var i = 0; i < this.faces.length; ++i) {
        var faceNormal = calcFaceNormal(this, i);
        for (var j = 0; j < this.faces[i].length - 2; ++j) {
          var v1 = this.faces[i][0];
          var v2 = this.faces[i][j + 1];
          var v3 = this.faces[i][j + 2];

          avgNormals[v1] = avgNormals[v1].add(faceNormal);
          avgNormals[v2] = avgNormals[v2].add(faceNormal);
          avgNormals[v3] = avgNormals[v3].add(faceNormal);
        }
      }

      for (var i = 0; i < avgNormals.length; ++i) {
        var n = avgNormals[i].unit();
        normals.push(n.x, n.y, n.z);
      }
    }

    this.indexCount = indices.length;
    this.edgeIndexCount = edgeIndices.length;
    this.positionVbo = createVertexBuffer(this.gl, positions);
    this.normalVbo = createVertexBuffer(this.gl, normals);
    this.indexIbo = createIndexBuffer(this.gl, indices);
    this.edgeIndexIbo = createIndexBuffer(this.gl, edgeIndices);
  }

  attachVariablesToShader(gl, modelViewProjection, model) {
    // vertex positions
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionVbo);
    var positionAttrib = gl.getAttribLocation(this.shaderProgram, "Position");
    gl.enableVertexAttribArray(positionAttrib);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);

    // vertex normals
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalVbo);
    var normalAttrib = gl.getAttribLocation(this.shaderProgram, "Normal");
    gl.enableVertexAttribArray(normalAttrib);
    gl.vertexAttribPointer(normalAttrib, 3, gl.FLOAT, false, 0, 0);

    // vertex colors
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.colorVbo);
    // const colorAttrib = gl.getAttribLocation(this.shaderProgram, "Color");
    // gl.enableVertexAttribArray(colorAttrib);
    // gl.vertexAttribPointer(colorAttrib, 3, gl.FLOAT, false, 0, 0);

    // index buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexIbo);

    // add model view projection and model matrices
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
  }

  render(model, view, projection) {
    this.gl.useProgram(this.shaderProgram);

    var modelViewProjection = projection.multiply(view).multiply(model);
    this.attachVariablesToShader(this.gl, modelViewProjection, model);

    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.indexCount,
      this.gl.UNSIGNED_SHORT,
      0
    );
  }
}
