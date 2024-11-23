class LSystemTree {
    constructor(center, axiom, rules, iterations, length, angle, radius, resolution, decayFactor = 0.0) {
        this.center = center;
        this.axiom = axiom;
        this.rules = rules;
        this.iterations = iterations;
        this.length = length;
        this.angle = angle;
        this.radius = radius;
        this.resolution = resolution;
        this.decayFactor = decayFactor;

        this.vertices = [];
        this.faces = [];
        this.generate();
    }

    generate() {
        const stateStack = [];
        //the position for where it starts
        let position = { ...this.center };
        //starting direction is straight up
        const direction = vec3.fromValues(0, 1, 0);
        //generation is which level of growth it's on
        let generation = 0;

        let currentString = this.axiom;

        // apply the rules on the string
        for (let i = 0; i < this.iterations; i++) {
            currentString = this.applyRules(currentString);
        }

        // parse the lsystem string
        for (let char of currentString) {
            switch (char) {
                case "F": {
                    const endPosition = this.getEndPosition(position, direction, this.length);

                    // color
                    const baseColor = [0.0, 0.7, 0.0]; // Dark green (base)
                    const leafColor = [0.0, 0.5, 0.0]; // Green (higher branches)
                    const color = this.interpolateColor(baseColor, leafColor, generation);

                    //create cylinder from the position to the endposition
                    const { vertices, faces } = this.createCylinder(position, endPosition, this.radius, this.resolution);

                    // add mesh
                    this.addMesh(vertices, faces, color);

                    // update position
                    position = { ...endPosition };

                    console.log("Position after F:", position);
                    break;
                }

                case "+": {
                    // positive rotation
                    this.rotate(direction, this.angle);
                    console.log("Direction after +:", direction);
                    break;
                }

                case "-": {
                    // negative rotation
                    this.rotate(direction, -this.angle);
                    console.log("Direction after -:", direction);
                    break;
                }

                case "[": {
                    // save current state
                    stateStack.push({
                        position: { ...position },
                        direction: vec3.clone(direction),
                        generation,
                    });
                    generation++;
                    break;
                }

                case "]": {
                    // pop the previous state
                    const prevState = stateStack.pop();
                    position = { ...prevState.position };
                    vec3.copy(direction, prevState.direction);
                    generation = prevState.generation;
                    break;
                }
            }
        }
    }

    // end position of the cylinder
    getEndPosition(startPosition, direction, length) {
        return {
            x: startPosition.x + direction[0] * length,
            y: startPosition.y + direction[1] * length,
            z: startPosition.z + direction[2] * length,
        };
    }

    // Rotate cylinder
    rotate(direction, angle) {
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
    }
    

    // create cylinder
    createCylinder(startPosition, endPosition, radius, resolution) {
        return cylinder(startPosition, endPosition, radius, resolution);
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

        // Add faces with adjusted indices
        this.faces.push(...faces.map((face) => face.map((i) => i + offset)));
    }

    static renderAll(gl, trees, camera) {
        trees
            .map((tree) => new Mesh(gl, tree.vertices, tree.faces))
            .forEach((mesh) => mesh.render(camera.model, camera.view, camera.projection));
    }
}


  