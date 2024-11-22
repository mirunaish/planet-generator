class Mesh {
  constructor(gl, vertices, faces = null, normals = null, lines = null) { 
    this.gl = gl;
    this.vertices = vertices;
    this.faces = faces;
    this.lines = lines; 
    if (normals && normals.length) this.normals = normals;

    // create the shader program from the two source codes
    this.shaderProgram = createShaderProgram(
      this.gl,
      vertexSource,
      fragmentSource
    );

    this.toGLMesh();
  }

  toGLMesh() {
    const positions = [];

    // Convert array of vertices to array of coordinates
    for (const vertex of this.vertices) {
      positions.push(vertex.x, vertex.y, vertex.z);
    }

    // Create position buffer
    this.positionVbo = createVertexBuffer(this.gl, positions);

    // Create normal buffer if normals exist
    if (this.normals) {
      const normals = this.normals.flatMap((n) => {
        const unit = n.unit();
        return [unit.x, unit.y, unit.z];
      });
      this.normalVbo = createVertexBuffer(this.gl, normals);
    }

    // Handle indices for faces (triangles)
    if (this.faces) { 
      const indices = [];
      const edgeIndices = [];
      for (const face of this.faces) {
        for (let j = 0; j < face.length - 2; j++) {
          indices.push(face[0], face[j + 1], face[j + 2]);
        }
        for (let j = 0, k = face.length - 1; j < face.length; k = j++) {
          edgeIndices.push(face[k], face[j]);
        }
      }
      this.indexCount = indices.length;
      this.edgeIndexCount = edgeIndices.length;
      this.indexIbo = createIndexBuffer(this.gl, indices);
      this.edgeIndexIbo = createIndexBuffer(this.gl, edgeIndices);
    }

    // Handle indices for lines
    if (this.lines) { 
      this.lineIndexCount = this.lines.length / 2;
      this.lineIndexIbo = createIndexBuffer(this.gl, this.lines);
    }
  }

  attachVariablesToShader(gl, modelViewProjection, model) {
    // Vertex positions
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionVbo);
    const positionAttrib = gl.getAttribLocation(this.shaderProgram, "Position");
    gl.enableVertexAttribArray(positionAttrib);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);

    // Vertex normals
    if (this.normalVbo) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalVbo);
      const normalAttrib = gl.getAttribLocation(this.shaderProgram, "Normal");
      gl.enableVertexAttribArray(normalAttrib);
      gl.vertexAttribPointer(normalAttrib, 3, gl.FLOAT, false, 0, 0);
    }

    // Add model view projection and model matrices
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

    const modelViewProjection = projection.multiply(view).multiply(model);
    this.attachVariablesToShader(this.gl, modelViewProjection, model);

    if (this.faces) { 
      // Render triangles
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexIbo);
      this.gl.drawElements(
        this.gl.TRIANGLES,
        this.indexCount,
        this.gl.UNSIGNED_SHORT,
        0
      );
    }
  }

  renderLines(model, view, projection) { 
    this.gl.useProgram(this.shaderProgram);

    const modelViewProjection = projection.multiply(view).multiply(model);
    this.attachVariablesToShader(this.gl, modelViewProjection, model);

    if (this.lines) { 
      // Render lines
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.lineIndexIbo);
      this.gl.drawElements(
        this.gl.LINES, 
        this.lineIndexCount,
        this.gl.UNSIGNED_SHORT,
        0
      );
    }
  }
}
