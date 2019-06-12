/**
 * Constant values used by the app
 */

const BLOOD_GLUCOSE_LEVELS = {
  "mg/dL": {
    unit: "mg/dL",
    range: [0, 250],
    goodRange: [72, 126],
    croppedRange: [70, 160]
  },
  "mmol/L": {
    unit: "mmol/L",
    range: [0, 21],
    goodRange: [4, 6.9],
    croppedRange: [2, 10]
  }
};

// This could potentially be configurable via User Settings down the road.
const LOCALE_BLOOD_GLUCOSE_LEVELS = BLOOD_GLUCOSE_LEVELS["mg/dL"];

const ENTRY_TAGS = [
  "breakfast",
  "meal",
  "snack",
  "beverage",
  "alcohol",
  "exercise",
  "feeling",
  "other"
];

export { LOCALE_BLOOD_GLUCOSE_LEVELS, ENTRY_TAGS };
