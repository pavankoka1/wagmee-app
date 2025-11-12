/**
 * Calculates profit/loss percentages for different timeframes
 * @param {Array} chartData - Array of {time, open, high, low, close} objects
 * @param {number} currentPrice - Current stock price
 * @returns {Object} Profit percentages for 1D, 3M, 6M, 1Y
 */
const calculateStockProfits = (chartData, currentPrice) => {
    if (!chartData || chartData.length === 0 || !currentPrice) {
        return {
            '1D': { profit: 0, percentage: 0 },
            '3M': { profit: 0, percentage: 0 },
            '6M': { profit: 0, percentage: 0 },
            '1Y': { profit: 0, percentage: 0 },
        };
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // Helper to find price at a specific date
    const findPriceAtDate = (targetDate) => {
        // Find the closest data point before or on the target date
        let closestData = null;
        let closestDiff = Infinity;

        for (const dataPoint of chartData) {
            const dataDate = new Date(dataPoint.time);
            const diff = targetDate.getTime() - dataDate.getTime();
            
            if (diff >= 0 && diff < closestDiff) {
                closestDiff = diff;
                closestData = dataPoint;
            }
        }

        // If no data before target date, use the earliest available
        if (!closestData && chartData.length > 0) {
            closestData = chartData[0];
        }

        return closestData ? closestData.close : null;
    };

    // Calculate for each timeframe
    const calculateProfit = (targetDate, label) => {
        const priceAtDate = findPriceAtDate(targetDate);
        if (!priceAtDate || priceAtDate === 0) {
            return { profit: 0, percentage: 0 };
        }

        const profit = currentPrice - priceAtDate;
        const percentage = ((profit / priceAtDate) * 100);

        return {
            profit: parseFloat(profit.toFixed(2)),
            percentage: parseFloat(percentage.toFixed(2)),
        };
    };

    // For 1D, use yesterday's close (second to last data point)
    let oneDayPrice = null;
    if (chartData.length >= 2) {
        oneDayPrice = chartData[chartData.length - 2].close;
    } else if (chartData.length === 1) {
        oneDayPrice = chartData[0].close;
    }

    const oneDayProfit = oneDayPrice
        ? {
              profit: parseFloat((currentPrice - oneDayPrice).toFixed(2)),
              percentage: parseFloat(
                  (((currentPrice - oneDayPrice) / oneDayPrice) * 100).toFixed(2)
              ),
          }
        : { profit: 0, percentage: 0 };

    return {
        '1D': oneDayProfit,
        '3M': calculateProfit(threeMonthsAgo, '3M'),
        '6M': calculateProfit(sixMonthsAgo, '6M'),
        '1Y': calculateProfit(oneYearAgo, '1Y'),
    };
};

export default calculateStockProfits;

