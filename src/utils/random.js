class Random {
  /**
   * create a random generator with a given seed.
   * ideally the seed should be RANDOM_SEED + some number so that changing
   * the RANDOM_SEED results in a totally different world but different elements
   * of it use different random numbers / noise
   */
  constructor(seed) {
    // seed the random number generator and noise generator
    this.seed = seed;
    this.openSimplex = new openSimplexNoise(this.seed);
    this.sRandom = seededRandom(this.seed);
  }

  /**
   * get noise value;
   * add multiple octaves (given as number or array)
   * and scale to [min, max] (roughly)
   */
  noise({ x, z }, scale = 1, octaves = 1, { min, max } = { min: -1, max: 1 }) {
    let n = 0;

    if (!octaves.length) octaves = Array.from({ length: octaves }, (_, i) => i);

    // add together octaves, scaled by 2 each time
    for (let i of octaves) {
      const size = 2 ** i;
      const d = i * 1; // offset noise so it doesn't all shrink towards the center
      n +=
        this.openSimplex.noise2D(x * scale * size + d, z * scale * size + d) /
        size;
    }

    // scale to [min, max] (roughly) (n may not be [-1, 1] if octaves > 1)
    n = ((n + 1) / 2) * (max - min) + min;

    return n;
  }

  noise3D(
    { x, y, z },
    scale = 1,
    octaves = 1,
    { min, max } = { min: -1, max: 1 }
  ) {
    let n = 0;

    if (!octaves.length) octaves = Array.from({ length: octaves }, (_, i) => i);

    // add together octaves, scaled by 2 each time
    for (let i of octaves) {
      const size = 2 ** i;
      const d = i * 1; // offset noise so it doesn't all shrink towards the center
      n +=
        this.openSimplex.noise3D(
          x * scale * size + d,
          y * scale * size + d,
          z * scale * size + d
        ) / size;
    }

    // scale to [min, max] (roughly) (n may not be [-1, 1] if octaves > 1)
    n = ((n + 1) / 2) * (max - min) + min;

    return n;
  }

  /** TODO make this seedable */
  random() {
    return this.sRandom();
  }

  /** return a random option from an array of choices */
  choice(options) {
    const length = options.length;
    const index = Math.floor(this.random() * length);
    if (index == length) index--; // in case random is exactly 1

    return options[index];
  }
}
