/**
 * Converts a raw numeric value into a normalized bucket for visualization
 * @param {number} value - The raw value to scale
 * @param {number} min - Minimum value in the dataset
 * @param {number} max - Maximum value in the dataset
 * @param {number} [scaleMin=1] - Minimum bucket value
 * @param {number} [scaleMax=11] - Maximum bucket value
 * @returns {number} Normalized bucket value between scaleMin and scaleMax
 * @example
 * // Scale a value of 75 within range 0-100 to a 1-11 scale
 * scaleValueToBucket(75, 0, 100, 1, 11); // Returns ~8
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
 * Calculates statistical ranges (min/max) for specified data fields
 * @param {Array<Object>} dataArr - Array of country data objects
 * @param {string[]} fields - Array of field names to analyze
 * @returns {Object} Statistics object with min/max for each field
 * @example
 * const data = [{gdp: 1000, population: 5000000}, {gdp: 2000, population: 10000000}];
 * gatherStats(data, ['gdp', 'population']);
 * // Returns: { gdp: {min: 1000, max: 2000}, population: {min: 5000000, max: 10000000} }
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
  
/**
 * Creates a normalized dataset with scaled values for visualization
 * @param {Object} details - Raw country data indexed by ISO code
 * @param {string[]} fields - Field names to normalize
 * @returns {Object} Normalized data with scaled values (3-6 range by default)
 * @example
 * const rawData = { 
 *   'US': { gdp: 20000, population: 330000000 },
 *   'CA': { gdp: 1800, population: 38000000 }
 * };
 * createNormalizedObject(rawData, ['gdp', 'population']);
 * // Returns normalized data with scaled values for visualization
 */
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