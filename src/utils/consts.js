const RANDOM_SEED = 29576359; // seed for the rng. just a random number
const RENDER_DISTANCE = 2; // # chunks to render in each direction
const CHUNK_SIZE = 16; // # meters in each direction

const BIOME_SIZE = 4; // approx size of a biome in chunks
const SEA_LEVEL = 0; // height of water

const PLAYER_HEIGHT = 1.8; // how high the eyes are above the ground, in meters
const WALKING_SPEED = 0.1; // meters per frame
const RUNNING_SPEED = 0.3; // meters per frame when shift pressed
const CAMERA_SPEED = 0.2;

const COLORS = {
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
  water: { r: 0.1, g: 0.2, b: 0.5 },
};
