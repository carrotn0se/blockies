# Blockies

An improved library for generating blockies with more options to tweak.

![Sample blockies image](examples/sample.png "Blockies")

[**Demo page**](http://carrotn0se.github.io/blockies/)

## Installation

```console
npm install @carrotn0se/blockies
```

## Browser

```javascript
import { createIcon } from "@carrotn0se/blockies";

var icon = createIcon({
  // All options are optional
  seed: "randstring", // seed used to generate icon data, default: random
  patternseed: "randstring", // seed used to generate pattern, default: copy seed
  colorseed: "randstring", // seed used to generate color, default: copy seed
  bgcolorseed: "randstring", // seed used to generate bgcolor, default: copy seed
  spotcolorseed: "randstring", // seed used to generate spotcolor, default: copy seed
  color: "#dfe", // default: random
  bgcolor: "#aaa", // default: random
  spotcolor: "#333", // default: random
  size: 15, // width/height of the icon in blocks, default: 8
  scale: 3, // width/height of each block in pixels, default: 4
});

document.body.appendChild(icon); // icon is a canvas element
```

In the above example the icon will be 15x15 blocks, and each block will be 3x3 pixels. The icon canvas will be 45x45 pixels.

## Node

```javascript
import { createCanvas } from "canvas";
import { renderIcon } from "@carrotn0se/blockies";

const canvas = createCanvas(50, 50);

var icon = renderIcon(
  {
    // All options are optional
    seed: "randstring", // seed used to generate icon data, default: random
    patternseed: "randstring", // seed used to generate pattern, default: copy seed
    colorseed: "randstring", // seed used to generate color, default: copy seed
    bgcolorseed: "randstring", // seed used to generate bgcolor, default: copy seed
    spotcolorseed: "randstring", // seed used to generate spotcolor, default: copy seed
    color: "#dfe", // default: random
    bgcolor: "#aaa", // default: random
    spotcolor: "#333", // default: random
    size: 15, // width/height of the icon in blocks, default: 8
    scale: 3, // width/height of each block in pixels, default: 4
  },
  canvas
);
```

## Notes

The defaults of size 10 and scale 5 generate 50x50 pixel icons. Below are some standard sizes that work well. A size larger than 10 will start generating more noisy icons that don't ressemble much.

- 24x24 `{size: 8, scale: 3}`
- 32x32 `{size: 8, scale: 4}`
- 48x48 `{size: 12, scale: 4}`

## Alternative Styles

- https://github.com/alexvandesande/blockies - More colors and alien faces

## Build

    npm run build

## License

[MIT](https://github.com/carrotn0se/blockies/blob/master/LICENSE)
