const TreeGenerator = {
  treeSeed: RANDOM_SEED + 94756,
  treeRandom: new Random(this.treeSeed),

  treeDensity: 4, // number of trees per chunk
  resolution: 6,

  /** all the rules etc for the different types of trees */
  types: {
    bamboo: {
      axiom: "F",
      rules: { F: "F[+F]F[-F]" },
      iterations: 3,
      length: 0.5,
      angle: 3, // (in degrees)
      radius: 0.1,
      decayFactor: 0,
    },
    smallTree: {
      axiom: "F",
      rules: { F: "F[+F]F[-F]F" },
      iterations: 2,
      length: 1,
      angle: 45,
      radius: 0.05,
      decayFactor: 0.2,
    },
    largeTree: {
      axiom: "F",
      rules: { F: "F[+F]F[-F]F" },
      iterations: 3,
      length: 2,
      angle: 15,
      radius: 0.1,
      decayFactor: 0.0,
    },
    bushyTree: {
      axiom: "F",
      rules: { F: "F[+F[+F]]F[-F[-F]]" },
      iterations: 3,
      length: 2,
      angle: 20,
      radius: 0.1,
      decayFactor: 0.5,
    },
    curvyTree: {
      axiom: "F",
      rules: { F: "FF-[-F+F+F]+[+F-F-F]" },
      iterations: 2,
      length: 0.5,
      angle: 15,
      radius: 0.1,
      decayFactor: 0.5,
    },
  },

  randomType: () => {
    return TreeGenerator.treeRandom.choice(Object.keys(TreeGenerator.types));
  },

  // end position of the cylinder
  getEndPosition: (startPosition, direction, length) => {
    return {
      x: startPosition.x + direction[0] * length,
      y: startPosition.y + direction[1] * length,
      z: startPosition.z + direction[2] * length,
    };
  },

  /**
   * Rotate direction vector angle degrees around a random axis
   * and return new direction
   */
  rotate: (direction, angle) => {
    const radian = (angle * Math.PI) / 180;
    const cosAngle = Math.cos(radian);
    const sinAngle = Math.sin(radian);

    // randomly select the axis to rotate cylinder around
    const axis = Math.floor(Math.random() * 3); // 0 = X, 1 = Y, 2 = Z

    if (axis === 0) {
      // Rotate around the x-axis
      const newY = direction[1] * cosAngle - direction[2] * sinAngle;
      const newZ = direction[1] * sinAngle + direction[2] * cosAngle;
      direction[1] = newY;
      direction[2] = newZ;
    } else if (axis === 1) {
      // Rotate around the y-axis
      const newX = direction[0] * cosAngle + direction[2] * sinAngle;
      const newZ = -direction[0] * sinAngle + direction[2] * cosAngle;
      direction[0] = newX;
      direction[2] = newZ;
    } else {
      // Rotate around the z-axis
      const newX = direction[0] * cosAngle - direction[1] * sinAngle;
      const newY = direction[0] * sinAngle + direction[1] * cosAngle;
      direction[0] = newX;
      direction[1] = newY;
    }

    return direction;
  },

  applyRules: (string, rules) => {
    return string
      .split("")
      .map((char) => rules[char] || char)
      .join("");
  },

  generate: ({ position: pos, treeType: type }) => {
    const vertices = [];
    const faces = [];
    const colors = [];
    const normals = [];

    addMesh = (newVertices, newFaces, color) => {
      const offset = vertices.length;

      // Add vertices
      vertices.push(...newVertices);

      // Add colors for each vertex
      const vertexColor = Array(newVertices.length).fill(color);
      colors.push(...vertexColor);

      // Add faces with adjusted indices
      faces.push(...newFaces.map((face) => face.map((i) => i + offset)));

      // add normals too
      normals.push(...computeNormals(newVertices, newFaces));
    };

    const { axiom, rules, iterations, length, angle, radius, decayFactor } =
      TreeGenerator.types[type];

    const stateStack = [];
    //the position for where it starts
    let position = { ...pos };
    //starting direction is straight up
    let direction = [0, 1, 0];
    //generation is which level of growth it's on
    let generation = 0;

    let currentString = axiom;

    // apply the rules on the string
    for (let i = 0; i < iterations; i++) {
      currentString = TreeGenerator.applyRules(currentString, rules);
    }

    // parse the lsystem string
    for (let char of currentString) {
      switch (char) {
        case "F": {
          const endPosition = TreeGenerator.getEndPosition(
            position,
            direction,
            length
          );

          // color
          const color = lerpColor(
            COLORS.tree.base,
            COLORS.tree.leaf,
            generation
          );

          //create cylinder from the position to the endposition
          const { vertices, faces } = cylinder(
            position,
            endPosition,
            radius,
            TreeGenerator.resolution
          );

          // add mesh
          addMesh(vertices, faces, color);

          // update position
          position = { ...endPosition };

          // console.log("Position after F:", position);
          break;
        }

        case "+": {
          // positive rotation
          TreeGenerator.rotate(direction, angle);
          // console.log("Direction after +:", direction);
          break;
        }

        case "-": {
          // negative rotation
          TreeGenerator.rotate(direction, -angle);
          // console.log("Direction after -:", direction);
          break;
        }

        case "[": {
          // save current state
          stateStack.push({
            position: { ...position },
            direction: [...direction],
            generation,
          });
          generation++;
          break;
        }

        case "]": {
          // pop the previous state
          const prevState = stateStack.pop();
          position = { ...prevState.position };
          direction = [...prevState.direction];
          generation = prevState.generation;
          break;
        }
      }
    }

    return { vertices, faces, normals, colors };
  },
};
