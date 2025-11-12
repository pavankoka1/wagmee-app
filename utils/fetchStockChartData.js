/**
 * Fetches historical stock data for charting
 * Uses free APIs to get stock data without external dependencies
 */

const fetchStockChartData = async (symbol, exchange = 'NSE', days = 30) => {
    try {
        // Option 1: Use your own backend API (RECOMMENDED for production)
        // Replace this with your actual backend endpoint that provides historical stock data
        const backendEndpoint = process.env.EXPO_PUBLIC_STOCKS_ENDPOINT;
        if (backendEndpoint) {
            try {
                // Try to fetch historical data from your backend
                // Adjust the endpoint and parameters based on your API
                const response = await fetch(
                    `${backendEndpoint}/historical?symbol=${symbol}&exchange=${exchange}&days=${days}`
                );
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.data && Array.isArray(data.data)) {
                        // Format data for Lightweight Charts
                        const chartData = data.data.map((item) => {
                            const date = new Date(item.date || item.time);
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            
                            return {
                                time: `${year}-${month}-${day}`,
                                open: parseFloat(item.open || item.close || 0),
                                high: parseFloat(item.high || item.close || 0),
                                low: parseFloat(item.low || item.close || 0),
                                close: parseFloat(item.close || 0),
                            };
                        }).filter(item => item.close > 0);
                        
                        if (chartData.length > 0) {
                            return chartData;
                        }
                    }
                }
            } catch (backendError) {
                console.warn('Backend API failed, trying alternative:', backendError);
            }
        }
        
        // Option 2: Use Yahoo Finance API (free, no key required)
        // Note: This may have CORS issues in some environments
        const yahooSymbol = exchange === 'NSE' ? `${symbol}.NS` : symbol;
        const endDate = Math.floor(Date.now() / 1000);
        const startDate = endDate - (days * 24 * 60 * 60);
        
        // Yahoo Finance API endpoint
        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?period1=${startDate}&period2=${endDate}&interval=1d&events=history`;
        
        try {
            const response = await fetch(yahooUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.chart && data.chart.result && data.chart.result[0]) {
                    const result = data.chart.result[0];
                    const timestamps = result.timestamp || [];
                    const quotes = result.indicators?.quote?.[0] || {};
                    const opens = quotes.open || [];
                    const highs = quotes.high || [];
                    const lows = quotes.low || [];
                    const closes = quotes.close || [];
                    
                    // Format data for Lightweight Charts
                    const chartData = timestamps
                        .map((timestamp, index) => {
                            // Convert timestamp to YYYY-MM-DD format
                            const date = new Date(timestamp * 1000);
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            
                            const open = opens[index];
                            const high = highs[index];
                            const low = lows[index];
                            const close = closes[index];
                            
                            // Skip if no valid data
                            if (!close || close === 0) return null;
                            
                            return {
                                time: `${year}-${month}-${day}`,
                                open: parseFloat(open || close),
                                high: parseFloat(high || close),
                                low: parseFloat(low || close),
                                close: parseFloat(close),
                            };
                        })
                        .filter(item => item !== null && item.close > 0);
                    
                    if (chartData.length > 0) {
                        return chartData;
                    }
                }
            }
        } catch (yahooError) {
            console.warn('Yahoo Finance API failed:', yahooError);
        }
        
        // Option 3: Fallback - Generate sample data if all APIs fail
        // IMPORTANT: In production, implement a proper backend API for stock data
        console.warn('All APIs failed. Using fallback data. Implement a backend API for production use.');
        return generateFallbackData(days);
        
    } catch (error) {
        console.error('Error fetching stock chart data:', error);
        // Return fallback data
        return generateFallbackData(days);
    }
};

/**
 * Generates fallback sample data when API is unavailable
 * In production, replace this with your own backend API
 */
const generateFallbackData = (days) => {
    const data = [];
    const basePrice = 100;
    let currentPrice = basePrice;
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        // Simulate price movement
        const change = (Math.random() - 0.5) * 4;
        currentPrice = Math.max(50, currentPrice + change);
        
        const open = currentPrice + (Math.random() - 0.5) * 2;
        const close = currentPrice;
        const high = Math.max(open, close) + Math.random() * 3;
        const low = Math.min(open, close) - Math.random() * 3;
        
        data.push({
            time: `${year}-${month}-${day}`,
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2)),
        });
    }
    
    return data;
};

export default fetchStockChartData;

