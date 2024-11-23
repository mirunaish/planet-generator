function loadTexture(gl, path) {
  const image = new Image();
  const texture = gl.createTexture();

  // when image loads, create gl texture
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0, // level?
      gl.RGB,
      gl.RGB,
      gl.UNSIGNED_BYTE,
      image
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  };

  image.src = path;

  return texture;
}

/** everything below copied with small modifications from assignment 3 glUtil.js */

function createVertexBuffer(gl, vertexData) {
  // Create a buffer
  var vbo = gl.createBuffer();
  // Bind it to the ARRAY_BUFFER target
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  // Copy the vertex data into the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
  // Return created buffer
  return vbo;
}

function createIndexBuffer(gl, indexData) {
  // Create a buffer
  var ibo = gl.createBuffer();
  // Bind it to the ELEMENT_ARRAY_BUFFER target
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  // Copy the index data into the buffer
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indexData),
    gl.STATIC_DRAW
  );
  // Return created buffer
  return ibo;
}

/** create a fragment or vertex shader */
function createShaderObject(gl, shaderSource, shaderType) {
  // Create a shader object of the requested type
  var shaderObject = gl.createShader(shaderType);
  // Pass the source code to the shader object
  gl.shaderSource(shaderObject, shaderSource);
  // Compile the shader
  gl.compileShader(shaderObject);

  // Check if there were any compile errors
  if (!gl.getShaderParameter(shaderObject, gl.COMPILE_STATUS)) {
    // If so, get the error and output some diagnostic info
    // Add some line numbers for convenience
    var lines = shaderSource.split("\n");
    for (var i = 0; i < lines.length; ++i)
      lines[i] = ("   " + (i + 1)).slice(-4) + " | " + lines[i];
    shaderSource = lines.join("\n");

    throw new Error(
      (shaderType == gl.FRAGMENT_SHADER ? "Fragment" : "Vertex") +
        " shader compilation error for shader':\n\n    " +
        gl.getShaderInfoLog(shaderObject).split("\n").join("\n    ") +
        "\nThe shader source code was:\n\n" +
        shaderSource
    );
  }

  return shaderObject;
}

/**
 * create a shader program from a vertex shader source and a fragment shader
 * source
 */
function createShaderProgram(gl, vertexSource, fragmentSource) {
  // Create shader objects for vertex and fragment shader
  var vertexShader = createShaderObject(gl, vertexSource, gl.VERTEX_SHADER);
  var fragmentShader = createShaderObject(
    gl,
    fragmentSource,
    gl.FRAGMENT_SHADER
  );

  // Create a shader program
  var program = gl.createProgram();
  // Attach the vertex and fragment shader to the program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  // Link the shaders together into a program
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(
      "Shader linking error':\n\n    " +
        gl.getProgramInfoLog(program).split("\n").join("\n    ")
    );
  }

  return program;
}
