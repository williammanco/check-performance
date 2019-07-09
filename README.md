# check-performance

Small utility to check realtime performance level for **scalable** quality project.
Check current performance based on fps/ms of project during navigation.

[Github repo](https://github.com/williammanco/check-performance)

## Install

```sh
yarn add check-performance
```

## Features
```
  ☮️ dependecy free
  📦 598 byte (gzipped)
  🚀 every frame ~0.02ms
  🧟 no internal timing
  👟 flexible
  🤘 functional
```

## Example

```js
import checkPerf from 'check-performance'

let checked = false;

const onChange = (level) => {
  if (level < 3) { // level from 0 to 5
    console.log('limit quality', level)
    checked = true;
  }
}
const { update: updateCheckPerf } = checkPerf(onChange/*, options*/);

const rAF = () => {
	if (!checked) updateCheckPerf();
	requestAnimationFrame(rAF);
};

rAF();

```

## Options

```js
const options = {
  samples: 64, // number of samples (for FPS average)
  every: 32, // save sample every ~32ms
  limit: 55, // decrease/increase level from this FPS limit
  mode: 1, // 0 = sequential, 1 = precise
  maxLevel: 5, // max level quality
  maxFps: 60, // your fps limit
}
```

## Build

```sh
yarn build
```

# License

MIT © [William Manco](mailto:wmanco88@gmail.com)