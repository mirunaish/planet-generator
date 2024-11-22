class Lsystem {
    constructor(axiom, rule) {
        this.axiom = axiom;
        this.rule = rule;
        this.line = axiom;
    }

    generate(iter) {
        for (let i = 0; i < iter; i++) {
            let nextLine = "";
            for ( let char of this.line) {
                nextLine += this.rule[char] || char;
            }
            this.line = nextLine;
        }
        return this.line;
    }

    interpret(scale = 1) {
        const positions = [];
        const stack = [];
        let currentPosition = [0,0,0];
        let currentDirection = [0, 1, 0];

        for (let char of this.line) {
            switch (char) {
                case "F":
                    const nextPosition = [
                        currentPosition[0] + scale * currentDirection[0],
                        currentPosition[1] + scale * currentDirection[1],
                        currentPosition[2] + scale * currentDirection[2], 
                    ];
                    positions.push([...currentPosition, ...nextPosition]);
                    currentPosition = nextPosition;
                    break;
                case "+":
                    currentDirection = rotateAroundAxis(currentDirection, [0, 0, 1], 25);
                    break;
                case "-":
                    currentDirection = rotateAroundAxis(currentDirection, [0, 0, 1], -25);
                    break;
                case "&":
                    currentDirection = rotateAroundAxis(currentDirection, [1, 0, 0], 25);
                    break;
                case "^":
                    currentDirection = rotateAroundAxis(currentDirection, [0, 0, 1], -25);
                    break;
                case "[":
                    stack.push({ position: [...currentPosition], direction: [...currentDirection]});
                    break;
                case "]":
                    const state = stack.pop();
                    currentPosition = state.position;
                    currentDirection = state.direction;
                    break;

            }
        }
        return positions;
    }
}

function rotateAroundAxis(vector, axis, angleDegrees) {
    const angle = (angleDegrees * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    // const crossProduct = axis.cross(vector);
    // const dotProduct = axis.dot(vector);
    const crossProduct = [
        axis[1] * vector[2] - axis[2] * vector[1],
        axis[2] * vector[0] - axis[0] * vector[2],
        axis[0] * vector[1] - axis[1] * vector[0]
    ];

    
    const dotProduct = axis[0] * vector[0] + axis[1] * vector[1] + axis[2] * vector[2];
    
    return [
        cos * vector[0] + sin * crossProduct[0] + (1 - cos) * dotProduct * axis[0],
        cos * vector[1] + sin * crossProduct[1] + (1 - cos) * dotProduct * axis[1],
        cos * vector[2] + sin * crossProduct[2] + (1 - cos) * dotProduct * axis[2],
    ];
}

