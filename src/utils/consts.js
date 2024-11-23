const RANDOM_SEED = 29576359; // seed for the rng. just a random number
const RENDER_DISTANCE = 2; // # chunks to render in each direction
const CHUNK_SIZE = 10; // # meters in each direction

const BIOME_SIZE = 4; // approx size of a biome in chunks
const SEA_LEVEL = 0; // height of water

const PLAYER_HEIGHT = 1.8; // how high the eyes are above the ground, in meters
const WALKING_SPEED = 0.05; // meters per frame
const RUNNING_SPEED = 0.1; // meters per frame when shift pressed
const CAMERA_SPEED = 0.2;

const COLORS = {
  sky: { r: 0.5, g: 0.8, b: 0.9 },
  ground: [
    { r: 0.247, g: 0.179, b: 0.11 }, // dark brown
    { r: 0.556, g: 0.408, b: 0.322 }, // brown
    { r: 0.698, g: 0.592, b: 0.514 }, // light brown
  ],
  sand: [
    { r: 0.8, g: 0.7, b: 0.3 }, // yellow
    { r: 0.9, g: 0.8, b: 0.5 }, // light yellow
    { r: 0.95, g: 0.9, b: 0.7 }, // very light yellow
  ],
  grass: [
    { r: 0.17, g: 0.26, b: 0.02 }, // dark green
    { r: 0.29, g: 0.427, b: 0.035 }, // green
    { r: 0.45, g: 0.65, b: 0.1 }, // yellowish green
  ],
  snow: [
    { r: 0.9, g: 0.9, b: 0.9 }, // light gray
    { r: 0.95, g: 0.95, b: 0.95 }, // very light grey
    { r: 1, g: 1, b: 1 }, // white
  ],
  water: { r: 0.1, g: 0.2, b: 0.5 },
};
