/**
 * Fetches current/latest stock price
 */
const fetchCurrentStockPrice = async (symbol, exchange = "NSE") => {
    try {
        // Option 1: Use your own backend API
        const backendEndpoint = process.env.EXPO_PUBLIC_STOCKS_ENDPOINT;
        if (backendEndpoint) {
            try {
                const response = await fetch(
                    `${backendEndpoint}/quote?symbol=${symbol}&exchange=${exchange}`
                );
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.price) {
                        return parseFloat(data.price);
                    }
                    if (data && data.data && data.data.price) {
                        return parseFloat(data.data.price);
                    }
                }
            } catch (backendError) {
                console.warn(
                    "Backend API failed for current price:",
                    backendError
                );
            }
        }

        // Option 2: Use Yahoo Finance API
        const yahooSymbol = exchange === "NSE" ? `${symbol}.NS` : symbol;
        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
            yahooSymbol
        )}?interval=1d&range=1d`;

        try {
            const response = await fetch(yahooUrl, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();

                if (data.chart && data.chart.result && data.chart.result[0]) {
                    const result = data.chart.result[0];
                    const meta = result.meta || {};
                    const regularMarketPrice =
                        meta.regularMarketPrice || meta.previousClose;

                    if (regularMarketPrice) {
                        return parseFloat(regularMarketPrice);
                    }

                    // Fallback: get from latest quote
                    const quotes = result.indicators?.quote?.[0];
                    if (quotes && quotes.close && quotes.close.length > 0) {
                        const latestClose =
                            quotes.close[quotes.close.length - 1];
                        if (latestClose) {
                            return parseFloat(latestClose);
                        }
                    }
                }
            }
        } catch (yahooError) {
            console.warn(
                "Yahoo Finance API failed for current price:",
                yahooError
            );
        }

        return null;
    } catch (error) {
        console.error("Error fetching current stock price:", error);
        return null;
    }
};

export default fetchCurrentStockPrice;
