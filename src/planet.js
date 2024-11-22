class Planet {
  constructor(gl) {
    this.gl = gl;

    this.camera = new Camera();
    this.chunks = [new Chunk()];
  }

  setCanvasSize(renderWidth, renderHeight) {
    this.renderWidth = renderWidth;
    this.renderHeight = renderHeight;
  }

  render() {
    // render each chunk with everything included in it
    this.chunks.forEach((chunk) => chunk.render());
  }
}
