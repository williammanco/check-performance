const checkPerformance = (onChange = () => null, options) => {
  const data = { fps: 0, average: 0, quality: false };

  const {
    samples,
    every,
    limit,
    mode,
    maxLevel,
    maxFps,
  } = Object.assign(
    {
      samples: 32,
      every: 64,
      limit: 55,
      mode: 1,
      maxLevel: 5,
      maxFps: 60,
    },
    options,
  );

  const self = {
    prev: 0,
    prevPerformance: 0,
    storedMs: 0,
    performance: maxLevel,
    store: [],
    average: maxFps,
  };

  const msToFps = value => 1000 / value;

  const setPerformance = () => {
    const fps = msToFps(self.average);

    switch (mode) {
      case 1:
        self.performance = 1;
        while ((maxFps / maxLevel) * self.performance < fps) self.performance += 1;
        break;
      default:
        self.performance += fps < limit ? -1 : 1;
    }

    self.performance = Math.max(Math.min(self.performance, maxLevel), 0);
    data.quality = self.performance;

    if (self.prevPerformance !== self.performance || !data.quality) onChange(self.performance, fps);

    self.prevPerformance = self.performance;
    return fps;
  };

  return {
    update: (t) => {
      const time = t || performance.now();
      const ms = time - self.prev;
      self.prev = time;

      if (ms === time) return;

      self.storedMs += ms;

      if (self.storedMs >= every) {
        if (ms === 0) return;

        self.prevPerformance = self.performance;

        self.store.push(ms);

        if (self.store.length > samples - 1) {
          self.average = self.store.reduce((p, c) => p + c) / self.store.length;
          data.average = setPerformance();
          self.store = [];
        }
        self.storedMs = 0;
      }

      data.fps = msToFps(ms);
    },
    data,
  };
};

export default checkPerformance;
