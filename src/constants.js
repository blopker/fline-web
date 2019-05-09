/**
 * Constant values used by the app
 */

const BLOOD_GLUCOSE_LEVELS = {
  "mg/dL": {
    unit: "mg/dL",
    range: [0, 350],
    ticks: [100, 200, 300],
    gridValues: [0, 50, 100, 150, 200, 250, 300, 350],
    good: {
      range: [72, 126]
    },
    zoomedIn: {
      range: [70, 160],

      tickStep: 30,
      gridStep: 15,

      ticks: [70, 100, 130, 160],
      gridValues: [70, 85, 100, 115, 130, 145, 160]
    }
  },
  "mmol/L": {
    unit: "mmol/L",
    range: [0, 21],
    ticks: [3, 6, 9, 12, 15, 18, 21],
    gridValues: [3, 6, 9, 12, 15, 18, 21],
    good: {
      range: [4, 6.9]
    },
    zoomedIn: {
      range: [2, 10],
      ticks: [2, 4, 6, 8, 10],
      gridValues: [2, 4, 6, 8, 10]
    }
  }
};

// This could potentially be configurable via User Settings down the road.
const LOCALE_BLOOD_GLUCOSE_LEVELS = BLOOD_GLUCOSE_LEVELS["mg/dL"];

export { LOCALE_BLOOD_GLUCOSE_LEVELS };
