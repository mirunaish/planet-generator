class Camera {
  constructor() {
    this.position = { x: 0, y: 0, z: 0 };
    this.up = { x: 0, y: 1, z: 0 }; // this probably won't change, unless you're looking straight up or down
    this.lookAt = { x: 1, y: 0, z: 0 };
  }
}
