/**
 * source: https://decode.sh/seeded-random-number-generator-in-js/
 */

function seededRandom(seed) {
  var m = 2 ** 35 - 31;
  var a = 185852;
  var s = seed % m;

  return function () {
    return (s = (s * a) % m) / m;
  };
}