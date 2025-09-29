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
        // Skip null/undefined values when gathering stats
        if (item[field] === null || item[field] === undefined || item[field] === '') {
          return;
        }
        const val = Number(item[field]);
        // Skip NaN values
        if (isNaN(val)) {
          return;
        }
        if (val < minVal) minVal = val;
        if (val > maxVal) maxVal = val;
      });
      stats[field] = { min: minVal, max: maxVal };
    });
    }
    return stats;
}
  
/**
 * Maps access_rank to preset restriction groups (1-5)
 * Based on BAL 2025 specifications:
 * - Group 1 (Extreme): Ranks 1-15
 * - Group 2 (Severe): Ranks 16-33
 * - Group 3 (Considerable): Ranks 34-50
 * - Group 4 (Some): Ranks 51-55
 * - Group 5 (Minimal): Ranks 56-88
 * @param {number} rank - Access rank value
 * @returns {number} Group number 1-5, or null if invalid
 */
export function getRestrictionGroup(rank) {
    if (!rank || rank < 1) return null;
    if (rank >= 1 && rank <= 15) return 1;
    if (rank >= 16 && rank <= 33) return 2;
    if (rank >= 34 && rank <= 50) return 3;
    if (rank >= 51 && rank <= 55) return 4;
    if (rank >= 56 && rank <= 88) return 5;
    return null;
}

/**
 * Maps needs_rank to preset shortage groups (1-10)
 * Based on BAL 2025 specifications:
 * - Group 1 (>10m): Ranks 1-4
 * - Group 2 (5-10m): Ranks 5-6
 * - Group 3 (3-5m): Ranks 7-9
 * - Group 4 (1-3m): Ranks 10-19
 * - Group 5 (500k-1m): Ranks 20-28
 * - Group 6 (250-500k): Ranks 29-32
 * - Group 7 (100-250k): Ranks 33-38
 * - Group 8 (50-100k): Ranks 39-45
 * - Group 9 (10-50k): Ranks 46-59
 * - Group 10 (<10k): Ranks 60-76
 * @param {number} rank - Needs rank value
 * @returns {number} Group number 1-10, or null if invalid
 */
export function getShortageGroup(rank) {
    if (!rank || rank < 1) return null;
    if (rank >= 1 && rank <= 4) return 1;
    if (rank >= 5 && rank <= 6) return 2;
    if (rank >= 7 && rank <= 9) return 3;
    if (rank >= 10 && rank <= 19) return 4;
    if (rank >= 20 && rank <= 28) return 5;
    if (rank >= 29 && rank <= 32) return 6;
    if (rank >= 33 && rank <= 38) return 7;
    if (rank >= 39 && rank <= 45) return 8;
    if (rank >= 46 && rank <= 59) return 9;
    if (rank >= 60 && rank <= 76) return 10;
    return null;
}

/**
 * Creates a normalized dataset with scaled values for visualization
 * @param {Object} details - Raw country data indexed by ISO code
 * @param {string[]} fields - Field names to normalize
 * @returns {Object} Normalized data with preset groups or scaled values
 * @example
 * const rawData = {
 *   'US': { access_rank: 15, gdp: 20000 },
 *   'CA': { access_rank: 25, gdp: 1800 }
 * };
 * createNormalizedObject(rawData, ['access_rank', 'gdp']);
 * // access_rank will use preset groups 1-5, gdp will be normalized 3-6
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
        // Preserve null/undefined values instead of normalizing them
        if (item[field] === null || item[field] === undefined || item[field] === '') {
          normalized[item.isoCode][field] = null;
          return;
        }
        const rawValue = Number(item[field]);
        // Skip NaN values
        if (isNaN(rawValue)) {
          normalized[item.isoCode][field] = null;
          return;
        }

        // Use preset groups for access_rank and needs_rank fields
        if (field === 'access_rank') {
          normalized[item.isoCode][field] = getRestrictionGroup(rawValue);
        } else if (field === 'needs_rank') {
          normalized[item.isoCode][field] = getShortageGroup(rawValue);
        } else {
          // Use scaling for other fields
          normalized[item.isoCode][field] = scaleValueToBucket(
            rawValue,
            stats[field].min,
            stats[field].max,3,6
          );
        }
      });
    }
    });

    return normalized;
}