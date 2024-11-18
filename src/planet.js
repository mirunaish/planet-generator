class Planet {
  constructor() {
    this.camera = new Camera();
    this.ground = new Ground();
  }

  render() {
    // rasterization algorithm probably goes here
  }
}

function setupPlanet() {
  const planet = new Planet();
  planet.render();
}
