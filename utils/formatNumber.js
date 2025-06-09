/**
 * Formats a number into K (thousands) or M (millions) format
 * @param {number} value - The number to format
 * @returns {string} Formatted number with K or M suffix
 */
export const formatNumber = (value) => {
    if (!value) return "0";

    const num = parseFloat(value);

    if (num >= 1000000) {
        // Convert to millions with 1 decimal place
        return `₹${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
        // Convert to thousands with no decimal places
        return `₹${Math.round(num / 1000)}K`;
    }

    // For numbers less than 1000, return as is
    return `₹${num}`;
};
