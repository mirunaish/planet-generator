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
    this.viewNoTranslation = Matrix.rotate(this.pitch, 1, 0, 0).multiply(
      Matrix.rotate(this.yaw, 0, 1, 0)
    );

    this.view = this.viewNoTranslation.multiply(
      Matrix.translate(-this.position.x, -this.position.y, -this.position.z)
    );
  }

  setProjection() {
    // fov, aspect, near, far
    this.projection = Matrix.perspective(60, this.w / this.h, 0.01, 1000);
  }

  setCanvasSize(renderWidth, renderHeight) {
    this.w = renderWidth;
    this.h = renderHeight;

    // recalculate projection matrix
    this.setProjection();
  }

  drag(dx, dy) {
    this.pitch = Math.min(Math.max(this.pitch + dy * CAMERA_SPEED, -90), 90);
    this.yaw = this.yaw + dx * CAMERA_SPEED;
    this.setView();
  }

  move(newX, newZ) {
    this.position.x = newX;
    this.position.z = newZ;
  }
}
