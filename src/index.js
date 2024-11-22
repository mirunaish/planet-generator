/** partly copied from assignment 3 glUtil.js */

/**
 * every time the window is resized, calculate new size and tell gl and planet
 * about the new size
 */
function setupCanvasSize(canvas, planet) {
  var renderWidth, renderHeight;
  function computeCanvasSize() {
    renderWidth = Math.min(canvas.parentNode.clientWidth - 20, 820);
    renderHeight = Math.floor((renderWidth * 9.0) / 16.0);

    canvas.style.width = `${renderWidth}px`;
    canvas.style.height = `${renderHeight}px`;

    const ratio = window.devicePixelRatio || 1;

    renderWidth = Math.floor(renderWidth * ratio);
    renderHeight = Math.floor(renderHeight * ratio);

    canvas.width = renderWidth;
    canvas.height = renderHeight;

    planet.mesh.gl.viewport(0, 0, renderWidth, renderHeight);
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

/** for moving forward, back, left, right */
function addKeyboardListeners(_canvas, planet) {
  let shiftDown = false;

  document.addEventListener("keydown", (event) => {
    if (event.key === "Shift") {
      shiftDown = true;
    } else if (event.key === "w" || event.key === "ArrowUp") {
      planet.camera.moveForward(shiftDown);
    } else if (event.key === "a" || event.key === "ArrowLeft") {
      planet.camera.moveLeft(shiftDown);
    } else if (event.key === "s" || event.key === "ArrowDown") {
      planet.camera.moveBackward(shiftDown);
    } else if (event.key === "d" || event.key === "ArrowRight") {
      planet.camera.moveRight(shiftDown);
    }
    planet.setPlayerYCoord(); // move player feet to ground height
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "Shift") {
      shiftDown = false;
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

  // clear canvas to white
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // create planet
  var planet = new Planet(gl);

  // set up canvas width and height
  setupCanvasSize(canvas, planet);

  // add event listeners for camera panning and movement etc
  addMouseListeners(canvas, planet);
  addKeyboardListeners(canvas, planet);

  // do the render loop
  var renderLoop = function () {
    planet.render();
    window.requestAnimationFrame(renderLoop);
  };
  window.requestAnimationFrame(renderLoop);
}
