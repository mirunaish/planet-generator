class LsystemPlant {
    constructor(gl, axiom, rule, iter, scale = 1) {
        this.gl = gl;
        this.lsystem = new Lsystem(axiom, rule);
        this.iter = iter;
        this.positions = this.generatePlant();
    }

    generatePlant() {
        const lSystemString = this.lsystem.generate(this.iter);
        return this.lsystem.interpret(this.scale);
    }

    render(camera) {
        const vertices = [];
        for (let segment of this.positions) {
            vertices.push(...segment);
        }

        const plantMesh = new Mesh(this.gl, vertices, null, null, this.createLines(vertices));
        plantMesh.renderLines(camera.model, camera.view, camera.projection);
    }

    createLines(vertices) {
        const lines = [];
        for (let i = 0; i < vertices.length; i += 6) {
            lines.push(i / 3, (i + 3) / 3);
        }
        return lines;
    }
}