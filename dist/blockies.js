'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// The random number is a js implementation of the Xorshift PRNG
let randseeds = {};

function seedrand(seed, target) {
  randseeds[target] = new Array(4); // Xorshift: [x, y, z, w] 32 bit values
  randseeds[target].fill(0);

  for (let i = 0; i < seed.length; i++) {
    randseeds[target][i % 4] =
      (randseeds[target][i % 4] << 5) -
      randseeds[target][i % 4] +
      seed.charCodeAt(i);
  }
}

function rand(target) {
  if (!randseeds[target]) {
    target = "fallback";
  }
  // based on Java's String.hashCode(), expanded to 4 32bit values
  const t = randseeds[target][0] ^ (randseeds[target][0] << 11);

  randseeds[target][0] = randseeds[target][1];
  randseeds[target][1] = randseeds[target][2];
  randseeds[target][2] = randseeds[target][3];
  randseeds[target][3] =
    randseeds[target][3] ^ (randseeds[target][3] >> 19) ^ t ^ (t >> 8);

  return (randseeds[target][3] >>> 0) / ((1 << 31) >>> 0);
}

function createColor(target) {
  //saturation is the whole color spectrum
  const h = Math.floor(rand(target) * 360);
  //saturation goes from 40 to 100, it avoids greyish colors
  const s = rand(target) * 60 + 40 + "%";
  //lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
  const l =
    (rand(target) + rand(target) + rand(target) + rand(target)) * 25 + "%";

  return "hsl(" + h + "," + s + "," + l + ")";
}

function createCumulativeArray(array) {
  let cumProbArray = [array[0]];
  for (let i = 1; i < array.length; i++) {
    cumProbArray[i] = cumProbArray[i - 1] + array[i];
  }
  return cumProbArray;
}

function generateRandomArray(cumProbArray, N) {
  // Generate random array
  let randomArray = [];
  for (let i = 0; i < N; i++) {
    let randomNum = rand("pattern") * cumProbArray.at(-1);
    for (let j = 0; j < cumProbArray.length; j++) {
      if (randomNum < cumProbArray[j]) {
        randomArray.push(j);
        break;
      }
    }
  }
  return randomArray;
}

function createImageData(opts) {
  const { size, bgcolorratio, colorratio, spotcolorratio } = opts;

  const cumulativeProbabilityArray = createCumulativeArray([
    bgcolorratio,
    colorratio,
    spotcolorratio,
  ]);

  const width = size; // Only support square icons for now
  const height = size;

  const dataWidth = Math.ceil(width / 2);
  const mirrorWidth = width - dataWidth;

  const data = [];
  for (let y = 0; y < height; y++) {
    let row = generateRandomArray(cumulativeProbabilityArray, dataWidth);

    const r = row.slice(0, mirrorWidth);
    r.reverse();
    row = row.concat(r);

    for (let i = 0; i < row.length; i++) {
      data.push(row[i]);
    }
  }

  return data;
}

function buildOpts(opts) {
  const newOpts = {};

  newOpts.seed =
    opts.seed || Math.floor(Math.random() * Math.pow(10, 16)).toString(16);

  seedrand(newOpts.seed, "fallback"); // used as fallback when certain seeds aren't defined
  if (opts.patternseed) {
    newOpts.patternseed = opts.patternseed;
    seedrand(newOpts.patternseed, "pattern");
  }
  if (opts.colorseed) {
    newOpts.colorseed = opts.colorseed;
    seedrand(newOpts.colorseed, "color");
  }
  if (opts.bgcolorseed) {
    newOpts.bgcolorseed = opts.bgcolorseed;
    seedrand(newOpts.bgcolorseed, "bgcolor");
  }
  if (opts.spotcolorseed) {
    newOpts.spotcolorseed = opts.spotcolorseed;
    seedrand(newOpts.spotcolorseed, "spotcolor");
  }

  newOpts.size = opts.size || 8;
  newOpts.scale = opts.scale || 4;
  newOpts.color = opts.color || createColor("color");
  newOpts.bgcolor = opts.bgcolor || createColor("bgcolor");
  newOpts.spotcolor = opts.spotcolor || createColor("spotcolor");

  newOpts.colorratio =
    opts.colorratio !== undefined && opts.colorratio !== null
      ? opts.colorratio
      : 30;
  newOpts.bgcolorratio =
    opts.bgcolorratio !== undefined && opts.bgcolorratio !== null
      ? opts.bgcolorratio
      : 60;
  newOpts.spotcolorratio =
    opts.spotcolorratio !== undefined && opts.spotcolorratio !== null
      ? opts.spotcolorratio
      : 10;

  return newOpts;
}

function renderIcon(opts, canvas) {
  randseeds = {};
  opts = buildOpts(opts || {});
  const imageData = createImageData(opts);
  const width = Math.sqrt(imageData.length);

  canvas.width = canvas.height = opts.size * opts.scale;

  const cc = canvas.getContext("2d");
  cc.fillStyle = opts.bgcolor;
  cc.fillRect(0, 0, canvas.width, canvas.height);
  cc.fillStyle = opts.color;

  for (let i = 0; i < imageData.length; i++) {
    // if data is 0, leave the background
    if (imageData[i]) {
      const row = Math.floor(i / width);
      const col = i % width;

      // if data is 2, choose spot color, if 1 choose foreground
      cc.fillStyle = imageData[i] == 1 ? opts.color : opts.spotcolor;

      cc.fillRect(col * opts.scale, row * opts.scale, opts.scale, opts.scale);
    }
  }

  return canvas;
}

function createIcon(opts) {
  var canvas = document.createElement("canvas");

  renderIcon(opts, canvas);

  return canvas;
}

exports.renderIcon = renderIcon;
exports.createIcon = createIcon;
