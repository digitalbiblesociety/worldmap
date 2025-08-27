/**
 * Color utility functions for the WorldMap component
 */

/**
 * Converts RGB color string to hexadecimal format
 * @param {string} rgb - RGB color string (e.g., "rgb(255, 0, 0)")
 * @returns {string} Hexadecimal color string (e.g., "#ff0000")
 */
export function rgbToHex(rgb) {
    if (!rgb || !rgb.startsWith('rgb')) {
        return rgb; // Return as-is if not RGB format
    }
    
    const rgbMatch = rgb.match(/\d+/g);
    if (!rgbMatch || rgbMatch.length < 3) {
        return '#e5e7eb'; // Default gray fallback
    }
    
    return '#' + rgbMatch.slice(0, 3).map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

/**
 * Gets the computed fill color from a country path element
 * @param {string} isoCode - Country ISO code
 * @param {Element} svg - SVG element containing the map
 * @returns {string} Hexadecimal color string or default gray
 */
export function getCountryColor(isoCode, svg) {
    if (!svg || !isoCode) {
        return '#e5e7eb'; // Default gray
    }
    
    try {
        const countryPath = svg.querySelector(`[data-iso="${isoCode}"] path`);
        if (!countryPath) {
            return '#e5e7eb'; // Default gray if path not found
        }
        
        const computedStyle = window.getComputedStyle(countryPath);
        const fillColor = computedStyle.fill;
        
        // Convert RGB to hex if needed
        const hexColor = rgbToHex(fillColor);
        
        // Return default gray if color is undefined or already default
        return hexColor && hexColor !== '#e5e7eb' ? hexColor : '#e5e7eb';
        
    } catch (error) {
        console.warn(`Failed to get color for country ${isoCode}:`, error);
        return '#e5e7eb'; // Default gray on error
    }
}

/**
 * Gets the default fallback color
 * @returns {string} Default gray color
 */
export function getDefaultColor() {
    return '#e5e7eb'; // gray-200
}

/**
 * Validates if a color string is valid
 * @param {string} color - Color string to validate
 * @returns {boolean} True if valid color
 */
export function isValidColor(color) {
    if (!color || typeof color !== 'string') {
        return false;
    }
    
    // Check for hex colors
    if (color.startsWith('#') && /^#[0-9A-Fa-f]{6}$/i.test(color)) {
        return true;
    }
    
    // Check for rgb colors
    if (color.startsWith('rgb') && /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(color)) {
        return true;
    }
    
    // Check for named colors (basic set)
    const namedColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'black', 'white', 'gray', 'grey'];
    return namedColors.includes(color.toLowerCase());
}