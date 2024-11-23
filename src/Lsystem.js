class LSystemTree {
    constructor(center, axiom, rules, iterations, length, angle, radius, resolution) {
      this.center = center;
      this.axiom = axiom;
      this.rules = rules;
      this.iterations = iterations;
      this.length = length;
      this.angle = angle;
      this.radius = radius;
      this.resolution = resolution;
  
      this.vertices = [];
      this.faces = [];
      this.generate();
    }


    
  
    generate() {
        const stateStack = [];
        const position = { ...this.center };
        const direction = vec3.fromValues(0, 1, 0); //starting direction is to go up
        const rotationMatrix = mat4.create();
        let generation = 0; // which layer of the tree is it on?
    
        let currentString = this.axiom;
    
        // loop through how many times i want to iterate
        for (let i = 0; i < this.iterations; i++) {
            currentString = this.applyRules(currentString);
        }
    
        // read the lsystem string
        for (let char of currentString) {
            switch (char) {
                case "F": {
                    // dark green for base and green for higher up
                    // have to edit fragment shader for colors to show
                    const baseColor = [0.0, 0.7, 0.0]; // Dark Green 
                    const leafColor = [0.0, 0.5, 0.0]; // Green 
    
                    // Interpolate between baseColor and leafColor based on generation
                    const color = this.interpolateColor(baseColor, leafColor, generation);
    
                    // create cylinder
                    const { vertices, faces } = cylinder(
                        position,
                        this.radius,
                        this.length,
                        this.resolution
                    );
    
                    // create mesh w the color
                    this.addMesh(vertices, faces, color);
    
                    // Move position forward
                    position.x += direction[0] * this.length;
                    position.y += direction[1] * this.length;
                    position.z += direction[2] * this.length;
    
                    console.log("Position after F:", position);
                    break;
                }
                
                //using https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix-min.js
                case "+": {
                    // Rotate positive
                    mat4.rotate(rotationMatrix, rotationMatrix, (this.angle * Math.PI) / 180, [0, 0, 1]);
                    vec3.transformMat4(direction, direction, rotationMatrix); 
                    vec3.normalize(direction, direction); 
                    console.log("Direction after +:", direction);
                    break;
                }
    
                case "-": {
                    // Rotate negative
                    mat4.rotate(rotationMatrix, rotationMatrix, (-this.angle * Math.PI) / 180, [0, 0, 1]);
                    vec3.transformMat4(direction, direction, rotationMatrix); 
                    vec3.normalize(direction, direction); 
                    console.log("Direction after -:", direction);
                    break;
                }
    
                case "[": {
                    // Push current state and move to next generation
                    stateStack.push({
                        position: { ...position },
                        direction: vec3.clone(direction),
                        rotationMatrix: mat4.clone(rotationMatrix),
                        generation: generation, // store generation
                    });
                    generation++; // increment
                    break;
                }
    
                case "]": {
                    // Pop state and go back to the prev generation
                    const prevState = stateStack.pop();
                    position.x = prevState.position.x;
                    position.y = prevState.position.y;
                    position.z = prevState.position.z;
                    vec3.copy(direction, prevState.direction);
                    mat4.copy(rotationMatrix, prevState.rotationMatrix);
                    generation = prevState.generation; // Restore the prev generation
                    break;
                }
            }
        }
    }
    
    // Interpolate between two colors based on a factor (0 to 1)
    interpolateColor(startColor, endColor, factor) {
        return startColor.map((start, index) => {
            return start + factor * (endColor[index] - start);
        });
    }
    
      
      
  
    applyRules(string) {
      return string.split("").map((char) => this.rules[char] || char).join("");
    }
  
    addMesh(vertices, faces, color) {
      const offset = this.vertices.length;
  
      // Add vertices
      this.vertices.push(...vertices);

      // Add colors for each vertex
      if (!this.colors) {
        this.colors = []; 
      }

      const vertexColor = Array(vertices.length).fill(color);
      this.colors.push(...vertexColor);

      //console.log("colors: " ,this.colors); 

  
      // Add faces with adjusted indices
      this.faces.push(...faces.map((face) => face.map((i) => i + offset)));
    }
  
    static renderAll(gl, trees, camera) {
      trees
        .map((tree) => new Mesh(gl, tree.vertices, tree.faces))
        .forEach((mesh) => mesh.render(camera.model, camera.view, camera.projection));
    }
  }
  
























// /** A procedural tree generated using L-System */
// class LSystemTree {
//     constructor(center, axiom, rules, iterations, length, angle, radius, resolution) {
//       this.center = center;
//       this.axiom = axiom;
//       this.rules = rules;
//       this.iterations = iterations;
//       this.length = length;
//       this.angle = angle;
//       this.radius = radius;
//       this.resolution = resolution;
  
//       this.generate(); // Generate vertices and faces upon instantiation
//     }
  
//     /** Generate the tree structure */
//     generate() {
//       const instructions = this.generateInstructions();
//       const { vertices, faces } = this.buildGeometry(instructions);
  
//       this.vertices = vertices;
//       this.faces = faces;
//     }
  
//     /** Generate the L-System instructions */
//     generateInstructions() {
//       let result = this.axiom;
  
//       for (let i = 0; i < this.iterations; i++) {
//         let newResult = '';
//         for (const char of result) {
//           newResult += this.rules[char] || char;
//         }
//         result = newResult;
//       }
  
//       return result;
//     }
  
//     /** Build geometry based on the L-System instructions */
//     buildGeometry(instructions) {
//       const stack = [];
//       const vertices = [];
//       const faces = [];
//       let position = { ...this.center };
//       let direction = { x: 0, y: 1, z: 0 };
  
//       for (const char of instructions) {
//         if (char === 'F') {
//           const base = { ...position };
//           position = {
//             x: position.x + this.length * direction.x,
//             y: position.y + this.length * direction.y,
//             z: position.z + this.length * direction.z,
//           };
  
//           const { vertices: cylVertices, faces: cylFaces } = this.buildCylinder(
//             base,
//             position
//           );
  
//           faces.push(...cylFaces.map(face => face.map(v => v + vertices.length)));
//           vertices.push(...cylVertices);
//         } else if (char === '+') {
//           direction = this.rotateDirection(direction, this.angle);
//         } else if (char === '-') {
//           direction = this.rotateDirection(direction, -this.angle);
//         } else if (char === '[') {
//           stack.push({ position: { ...position }, direction: { ...direction } });
//         } else if (char === ']') {
//           const state = stack.pop();
//           position = state.position;
//           direction = state.direction;
//         }
//       }
  
//       return { vertices, faces };
//     }
  
//     /** Build a single cylinder segment */
//     buildCylinder(base, top) {
//       return cylinder(base, this.radius, this.length, this.resolution);
//     }
  
//     /** Rotate direction vector by angle (in degrees) */
//     rotateDirection(direction, angle) {
//       const rad = (angle * Math.PI) / 180;
//       const cos = Math.cos(rad);
//       const sin = Math.sin(rad);
  
//       return {
//         x: direction.x * cos - direction.z * sin,
//         y: direction.y,
//         z: direction.x * sin + direction.z * cos,
//       };
//     }
  
//     /** Render all LSystem trees */
//     static renderAll(gl, allTrees, camera) {
//       allTrees
//         .map(tree => new Mesh(gl, tree.vertices, tree.faces))
//         .forEach(mesh => mesh.render(camera.model, camera.view, camera.projection));
//     }
//   }
  