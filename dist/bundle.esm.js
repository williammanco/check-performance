const checkPerformance = (onChange = () => null, options) => {
  const fps = { current: 0, average: 0 };

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
      mode: 0,
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
    const fpsValue = msToFps(self.average);

    switch (mode) {
      case 1:
        self.performance = 1;
        while ((maxFps / maxLevel) * self.performance < fpsValue) self.performance += 1;
        self.performance = Math.max(Math.min(self.performance, maxLevel), 0);
        break;
      default:
        self.performance += fpsValue < limit ? -1 : 1;
        self.performance = Math.min(Math.max(self.performance, 0), maxLevel);
    }

    if (self.prevPerformance !== self.performance) {
      onChange(self.performance, fpsValue);
    }

    self.prevPerformance = self.performance;
    return fpsValue;
  };

  return {
    update: (t) => {
      const time = t || performance.now();
      const ms = time - self.prev;
      self.prev = time;

      self.storedMs += ms;

      if (self.storedMs >= every) {
        if (ms === 0) return;

        self.prevPerformance = self.performance;

        self.store.push(ms);

        if (self.store.length > samples - 1) {
          self.average = self.store.reduce((p, c) => p + c) / self.store.length;
          fps.average = setPerformance();
          self.store = [];
        }
        self.storedMs = 0;
      }

      fps.current = msToFps(ms);
    },
    fps,
  };
};

export default checkPerformance;
