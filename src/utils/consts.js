RANDOM_SEED = 29576359; // seed for the rng. just a random number
RENDER_DISTANCE = 1; // # chunks to render in each direction
CHUNK_SIZE = 16; // # meters in each direction

BIOME_SIZE = 4; // approx size of a biome in chunks
SEA_LEVEL = 0; // height of water

PLAYER_HEIGHT = 1.8; // how high the eyes are above the ground, in meters
MOVEMENT_SPEED = 0.1; // meters per frame
RUNNING_SPEED = 0.3; // meters per frame when shift pressed
CAMERA_SPEED = 0.2;

COLORS = {
  sky: { r: 0.5, g: 0.8, b: 0.9 },
  ground: [
    { r: 0.6, g: 0.4, b: 0.05 }, // dark brown
    { r: 0.8, g: 0.4, b: 0.4 }, // lighter brown
    { r: 0.9, g: 0.5, b: 0.3 }, // sandy yellow
  ],
  grass: [
    { r: 0.2, g: 0.6, b: 0.1 }, // brown
    { r: 0.45, g: 0.85, b: 0.15 }, // yellowish green
    { r: 0.2, g: 0.85, b: 0.1 }, // green
  ],

  /**
   * get a gradient with given colors and their positions.
   * positions should be increasing from 0 to 1.
   * returns a function (t) => color:
   * for a t between 0 and 1, get the color at that position in the gradient
   */
  gradient: (colors, positions) => (t) => {
    // t may be out of bounds, return edge colors
    if (t <= 0) return colors[0];
    if (t >= 1) return colors[colors.length - 1];

    // find colors to left and right of t
    let right = 0;
    while (t > positions[right]) right++;
    const left = right - 1;
    const c1 = colors[left];
    const c2 = colors[right];

    // scale t to be between 0 and 1 (distance between a and b)
    const weight = (t - positions[left]) / (positions[right] - positions[left]);

    // interpolate btw c1 and c2
    const r = c1.r + weight * (c2.r - c1.r);
    const g = c1.g + weight * (c2.g - c1.g);
    const b = c1.b + weight * (c2.b - c1.b);

    return { r, g, b };
  },
};
