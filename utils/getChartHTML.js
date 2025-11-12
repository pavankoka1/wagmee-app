/**
 * Generates HTML for TradingView Lightweight Charts
 * This is a local implementation that doesn't load external TradingView content
 * to comply with App Store guidelines
 */
const getChartHTML = (symbol, initialData = []) => {
    // Convert data to the format expected by Lightweight Charts
    const formattedData = initialData.map(item => ({
        time: item.time,
        value: item.close || item.price || item.value
    }));

    return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Stock Chart</title>
    <!-- 
        NOTE: For maximum App Store compliance, consider bundling the library locally
        Download from: https://github.com/tradingview/lightweight-charts/releases
        Then replace this CDN link with a local file reference
    -->
    <script src="https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body, html {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #161616;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #chart-container {
            width: 100%;
            height: 100%;
            position: relative;
        }
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ffffff;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div id="chart-container">
        <div class="loading">Loading chart...</div>
    </div>
    <script>
        (function() {
            const container = document.getElementById('chart-container');
            const loadingEl = container.querySelector('.loading');
            
            // Initialize chart
            const chart = LightweightCharts.createChart(container, {
                width: window.innerWidth,
                height: window.innerHeight,
                layout: {
                    background: { color: '#161616' },
                    textColor: '#d1d5db',
                },
                grid: {
                    vertLines: { color: '#2a2a2a' },
                    horzLines: { color: '#2a2a2a' },
                },
                crosshair: {
                    mode: LightweightCharts.CrosshairMode.Normal,
                },
                rightPriceScale: {
                    borderColor: '#2a2a2a',
                },
                timeScale: {
                    borderColor: '#2a2a2a',
                    timeVisible: true,
                    secondsVisible: false,
                },
            });

            // Create candlestick series (more appropriate for stock charts)
            const candlestickSeries = chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
            });

            // If initial data is provided, set it
            const initialData = ${JSON.stringify(formattedData)};
            if (initialData && Array.isArray(initialData) && initialData.length > 0) {
                // Convert to candlestick format if needed
                const candlestickData = initialData
                    .map(item => {
                        if (!item || !item.time) return null;
                        
                        // If data is already in candlestick format, use it
                        if (item.open !== undefined && item.high !== undefined && 
                            item.low !== undefined && item.close !== undefined) {
                            return {
                                time: item.time,
                                open: parseFloat(item.open),
                                high: parseFloat(item.high),
                                low: parseFloat(item.low),
                                close: parseFloat(item.close)
                            };
                        }
                        
                        // Otherwise, create a simple candlestick from a single value
                        const value = parseFloat(item.value || item.close || item.price || 0);
                        if (value <= 0) return null;
                        
                        return {
                            time: item.time,
                            open: value,
                            high: value * 1.01,
                            low: value * 0.99,
                            close: value
                        };
                    })
                    .filter(item => item !== null);
                
                if (candlestickData.length > 0) {
                    candlestickSeries.setData(candlestickData);
                    loadingEl.style.display = 'none';
                } else {
                    loadingEl.textContent = 'No data available';
                }
            } else {
                loadingEl.textContent = 'Waiting for data...';
            }

            // Listen for messages from React Native to update chart
            window.addEventListener('message', function(event) {
                try {
                    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                    if (data.type === 'updateData' && data.data && Array.isArray(data.data)) {
                        const chartData = data.data
                            .map(item => {
                                if (!item || !item.time) return null;
                                
                                if (item.open !== undefined && item.high !== undefined && 
                                    item.low !== undefined && item.close !== undefined) {
                                    return {
                                        time: item.time,
                                        open: parseFloat(item.open),
                                        high: parseFloat(item.high),
                                        low: parseFloat(item.low),
                                        close: parseFloat(item.close)
                                    };
                                }
                                
                                // Fallback: create candlestick from single value
                                const value = parseFloat(item.value || item.close || item.price || 0);
                                if (value <= 0) return null;
                                
                                return {
                                    time: item.time,
                                    open: value,
                                    high: value * 1.01,
                                    low: value * 0.99,
                                    close: value
                                };
                            })
                            .filter(item => item !== null);
                        
                        if (chartData.length > 0) {
                            candlestickSeries.setData(chartData);
                            loadingEl.style.display = 'none';
                            
                            // Notify React Native that data was updated
                            if (window.ReactNativeWebView) {
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'dataUpdated',
                                    count: chartData.length
                                }));
                            }
                        } else {
                            loadingEl.textContent = 'No data available';
                        }
                    } else if (data.type === 'updateSymbol') {
                        // Symbol changed, chart will be updated with new data
                        loadingEl.style.display = 'block';
                        loadingEl.textContent = 'Loading chart...';
                    }
                } catch (e) {
                    console.error('Error processing message:', e);
                    loadingEl.textContent = 'Error loading chart data';
                }
            });

            // Notify React Native that chart is ready
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'chartReady'
                }));
            }

            // Handle resize
            window.addEventListener('resize', () => {
                chart.applyOptions({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            });
        })();
    </script>
</body>
</html>
`;
};

export default getChartHTML;

