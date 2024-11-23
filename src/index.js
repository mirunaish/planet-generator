/** partly copied from assignment 3 glUtil.js */

/**
 * every time the window is resized, calculate new size and tell gl and planet
 * about the new size
 */
function setupCanvasSize(canvas, planet) {
  var renderWidth, renderHeight;
  function computeCanvasSize() {
    renderHeight = canvas.parentNode.clientHeight;
    renderWidth = Math.floor((renderHeight * 16.0) / 9.0);

    canvas.style.width = `${renderWidth}px`;
    canvas.style.height = `${renderHeight}px`;

    const ratio = window.devicePixelRatio || 1;

    renderWidth = Math.floor(renderWidth * ratio);
    renderHeight = Math.floor(renderHeight * ratio);

    canvas.width = renderWidth;
    canvas.height = renderHeight;

    planet.gl.viewport(0, 0, renderWidth, renderHeight);
    planet.camera.setCanvasSize(renderWidth, renderHeight);
  }
  window.addEventListener("resize", computeCanvasSize);
  computeCanvasSize();
}

/** mouse listeners for looking around */
function addMouseListeners(canvas, planet) {
  var mouseDown = false;
  var lastMouseX, lastMouseY;
  var mouseMoveListener = function (event) {
    planet.camera.drag(event.screenX - lastMouseX, event.screenY - lastMouseY);
    lastMouseX = event.screenX;
    lastMouseY = event.screenY;
  };
  canvas.addEventListener("mousedown", function (event) {
    if (!mouseDown && event.button == 0) {
      mouseDown = true;
      lastMouseX = event.screenX;
      lastMouseY = event.screenY;
      document.addEventListener("mousemove", mouseMoveListener);
    }
    event.preventDefault();
  });
  document.addEventListener("mouseup", function (event) {
    if (mouseDown && event.button == 0) {
      mouseDown = false;
      document.removeEventListener("mousemove", mouseMoveListener);
    }
  });
}

running = false;
movingForward = false;
movingLeft = false;
movingRight = false;
movingBackward = false;

/** for moving forward, back, left, right */
function addKeyboardListeners(_canvas, planet) {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Shift") {
      running = true;
    }
    if (event.key === "w" || event.key === "W" || event.key === "ArrowUp") {
      movingForward = true;
    }
    if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
      movingLeft = true;
    }
    if (event.key === "s" || event.key === "S" || event.key === "ArrowDown") {
      movingBackward = true;
    }
    if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
      movingRight = true;
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "Shift") {
      running = false;
    }
    if (event.key === "w" || event.key === "W" || event.key === "ArrowUp") {
      movingForward = false;
    }
    if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
      movingLeft = false;
    }
    if (event.key === "s" || event.key === "S" || event.key === "ArrowDown") {
      movingBackward = false;
    }
    if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
      movingRight = false;
    }
  });
}

/** setup the planet generator and do the render loop */
function setupPlanetGenerator() {
  var canvas = document.getElementById("canvas");

  let gl;
  try {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  } catch (e) {}
  if (!gl) {
    console.log("Could not initialise WebGL");
    return;
  }

  gl.enable(gl.DEPTH_TEST); // enable z-buffering

  // create planet
  var planet = new Planet(gl);

  // set up canvas width and height
  setupCanvasSize(canvas, planet);

  // add event listeners for camera panning and movement etc
  addMouseListeners(canvas, planet);
  addKeyboardListeners(canvas, planet);

  // do the render loop
  var renderLoop = function () {
    // clear canvas to background (sky) color
    gl.clearColor(...COLORS.sky, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    planet.move(
      running,
      movingForward,
      movingLeft,
      movingRight,
      movingBackward
    );

    planet.render();
    window.requestAnimationFrame(renderLoop);
  };
  window.requestAnimationFrame(renderLoop);
}
