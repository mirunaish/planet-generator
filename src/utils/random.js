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
    this.openSimplex = new openSimplexNoise(self.seed);
  }

  /**
   * get noise value;
   * add multiple octaves
   * and scale to [min, max] (roughly)
   */
  noise({ x, z }, scale = 1, octaves = 1, { min, max } = { min: -1, max: 1 }) {
    let size = 1;
    let d = 0; // offset noise so it doesn't all shrink towards the center
    let n = 0;

    // add together octaves, scaled by 2 each time
    for (let i = 0; i < octaves; i++) {
      n +=
        this.openSimplex.noise2D(x * scale * size + d, z * scale * size + d) /
        size;
      size *= 2;
      d += 1;
    }

    // scale to [min, max] (roughly) (n may not be [-1, 1] if octaves > 1)
    n = ((n + 1) / 2) * (max - min) + min;

    return n;
  }
}
