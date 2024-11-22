class Camera {
  constructor() {
    this.position = { x: 0, y: 0, z: 0 };
    this.pitch = 0; // how up or down i'm looking, in degrees
    this.yaw = 0; // in which direction i'm facing, in degrees
    this.h = 0;
    this.w = 0;

    // everything is already in world space, so this is identity matrix
    this.model = new Matrix();
  }

  setView() {
    this.view = Matrix.rotate(this.pitch, 1, 0, 0)
      .multiply(Matrix.rotate(this.yaw, 0, 1, 0))
      .multiply(
        Matrix.translate(-this.position.x, -this.position.y, -this.position.z)
      );
  }

  setProjection() {
    // fov, aspect, near, far
    this.projection = Matrix.perspective(35, this.w / this.h, 0.01, 1000);
  }

  setCanvasSize(renderWidth, renderHeight) {
    this.w = renderWidth;
    this.h = renderHeight;

    // recalculate projection matrix
    this.setProjection();
  }

  drag(dx, dy) {
    this.pitch = Math.min(Math.max(this.pitch + dy * 0.5, -90), 90);
    this.yaw = this.yaw + dx * 0.5;
    this.setView();
  }

  moveForward(isRunning) {
    const speed = isRunning ? RUNNING_SPEED : MOVEMENT_SPEED;
    this.position.x -= Math.sin(-(Math.PI * this.yaw) / 180) * speed;
    this.position.z -= Math.cos(-(Math.PI * this.yaw) / 180) * speed;
  }

  moveLeft(isRunning) {
    const speed = isRunning ? RUNNING_SPEED : MOVEMENT_SPEED;
    this.position.x -= Math.cos(-(Math.PI * this.yaw) / 180) * speed;
    this.position.z += Math.sin(-(Math.PI * this.yaw) / 180) * speed;
  }

  moveRight(isRunning) {
    const speed = isRunning ? RUNNING_SPEED : MOVEMENT_SPEED;
    this.position.x += Math.cos(-(Math.PI * this.yaw) / 180) * speed;
    this.position.z -= Math.sin(-(Math.PI * this.yaw) / 180) * speed;
  }

  moveBackward(isRunning) {
    const speed = isRunning ? RUNNING_SPEED : MOVEMENT_SPEED;
    this.position.x += Math.sin(-(Math.PI * this.yaw) / 180) * speed;
    this.position.z += Math.cos(-(Math.PI * this.yaw) / 180) * speed;
  }
}
