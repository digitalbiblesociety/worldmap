/**
 * scaleValueToBucket converts a raw number into a range for our colors [1..11]
 */
export function scaleValueToBucket(value, min, max, scaleMin = 1, scaleMax = 11) {
    // Edge case: if all values are the same, return midpoint of scale
    if (min === max) {
      return Math.round((scaleMin + scaleMax) / 2);
    }
  
    // If value is outside the data range, clamp it to min or max
    if (value <= min) return scaleMin;
    if (value >= max) return scaleMax;
  
    // Linear interpolation into [scaleMin..scaleMax]
    // ratio = (value - min) / (max - min)
    // result = scaleMin + ratio * (scaleMax - scaleMin)
    const ratio = (value - min) / (max - min);
    const scaled = scaleMin + ratio * (scaleMax - scaleMin);
  
    return Math.round(scaled);
}
  /**
   * gatherStats calculates min and max for each field you want to normalize.
   * dataArr: array of country objects
   * fields: list of field names to track
   */
export function gatherStats(dataArr, fields) {
    const stats = {};
  
    if(fields.length) {
    fields.forEach((field) => {
      let minVal = Infinity;
      let maxVal = -Infinity;
      dataArr.forEach((item) => {
        const val = Number(item[field]);
        if (val < minVal) minVal = val;
        if (val > maxVal) maxVal = val;
      });
      stats[field] = { min: minVal, max: maxVal };
    });
    }
    return stats;
}
  
export function createNormalizedObject(details, fields) {
    const dataArr = Object.entries(details).map(([isoCode, details]) => ({
      isoCode,
      ...details,
    }));
  
    const stats = gatherStats(dataArr, fields);
    const normalized = {};

    dataArr.forEach((item) => {
      normalized[item.isoCode] = {
        ...item,
      };
  
      if(fields.length) {
      fields.forEach((field) => {
        const rawValue = Number(item[field]);
        normalized[item.isoCode][field] = scaleValueToBucket(
          rawValue,
          stats[field].min,
          stats[field].max,3,6
        );
      });
    }
    });
  
    return normalized;
}