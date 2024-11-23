/** adapted from assignment 3 GLMesh.js and Mesh.js */

class Mesh {
  constructor(
    vertices,
    faces,
    normals,
    colors,
    textureCoordinates,
    textures,
    textureWeights
  ) {
    this.gl = gl;
    this.vertices = vertices;
    this.faces = faces;
    if (normals && normals.length) this.normals = normals;
    if (colors && colors.length) this.colors = colors;
    if (textureCoordinates && textureCoordinates.length)
      this.textureCoordinates = textureCoordinates;
    if (textures && textures.length) {
      this.useTextures = textures.length;
      this.textures = textures.map((t) => loadTexture(this.gl, t));
    }
    if (textureWeights && textureWeights.length)
      this.textureWeights = textureWeights;

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
    // convert array of vertices to array of positions (coords)
    let positions = [];
    for (var i = 0; i < this.vertices.length; ++i) {
      positions.push(
        this.vertices[i].x,
        this.vertices[i].y,
        this.vertices[i].z
      );
    }

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
    }

    // calculate normals
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

    // convert array of colors to array of components
    let colors = [];
    if (this.colors) {
      for (let i = 0; i < this.colors.length; ++i) {
        colors.push(this.colors[i].r, this.colors[i].g, this.colors[i].b);
      }
    }

    // convert array of texture coordinates to array of components
    let textureCoordinates = [];
    if (this.textureCoordinates) {
      for (let i = 0; i < this.textureCoordinates.length; ++i) {
        textureCoordinates.push(
          this.textureCoordinates[i].u,
          this.textureCoordinates[i].v
        );
      }
    }

    this.indexCount = indices.length;
    this.positionVbo = createVertexBuffer(this.gl, positions);
    this.normalVbo = createVertexBuffer(this.gl, normals);
    if (this.colors) this.colorVbo = createVertexBuffer(this.gl, colors);
    this.indexIbo = createIndexBuffer(this.gl, indices);

    if (this.textureCoordinates)
      this.textureCoordinateVbo = createVertexBuffer(
        this.gl,
        textureCoordinates
      );
    if (this.textureWeights)
      this.textureWeightVbo = this.textureWeights.map((w) =>
        createVertexBuffer(this.gl, w)
      );
  }

  bindBuffer(attributeName, buffer, size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    var attribute = gl.getAttribLocation(this.shaderProgram, attributeName);
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, 0, 0);
  }

  attachVariablesToShader(gl, modelViewProjection, model) {
    // index buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexIbo);

    this.bindBuffer("Position", this.positionVbo, 3); // vertex positions
    this.bindBuffer("Normal", this.normalVbo, 3); // vertex normals

    // vertex colors
    if (this.colors) {
      this.bindBuffer("Color", this.colorVbo, 3);
    }

    // add everything texture related
    if (this.textureCoordinates && this.textureWeights && this.textures) {
      // add texture coords
      this.bindBuffer("TextureCoord", this.textureCoordinateVbo, 2);

      // add textures and weights
      for (let i = 0; i < this.textures.length; i++) {
        // texture itself
        const tloc = gl.getUniformLocation(this.shaderProgram, "uSampler" + i);
        gl.activeTexture(gl["TEXTURE" + i]);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
        gl.uniform1i(tloc, i); // set uniform to the texture unit, or something

        // weights
        this.bindBuffer("Texture" + i + "Weight", this.textureWeightVbo[i], 1);
      }
    }
    gl.uniform1i(
      gl.getUniformLocation(this.shaderProgram, "uUseTextures"),
      this.useTextures
    );

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
    this.gl.enable(gl.DEPTH_TEST); // enable z buffering

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
