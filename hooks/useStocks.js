import network from "@/network"; // Assuming this is used for network requests
import API_PATHS from "@/network/apis"; // Assuming this is used for API paths
import generateQueryParams from "@/utils/generateQueryParams"; // Utility to generate query params
import React, { useEffect, useState } from "react";

// Debounce function
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

function useStocks(searchText) {
    const [stocks, setStocks] = useState([]); // Renamed from users to stocks
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Added error state

    const fetchStocks = debounce(async (query) => {
        setLoading(true);
        setError(null); // Reset error state before fetching
        try {
            const response = await fetch(
                generateQueryParams(process.env.EXPO_PUBLIC_STOCKS_ENDPOINT, {
                    symbol: query,
                    exchange: "NSE",
                    country: "INDIA",
                })
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setStocks(
                data.data
                    .filter((stock) => stock.country.toLowerCase() === "india") // Filter for stocks in India
                    .reduce((acc, stock) => {
                        if (!acc.some((s) => s.symbol === stock.symbol)) {
                            // Check if the symbol is already in the accumulator
                            acc.push(stock); // Add the stock to the accumulator
                        }
                        return acc; // Return the accumulator
                    }, [])
            );
        } catch (err) {
            setError(err.message); // Set error message
        } finally {
            setLoading(false); // Set loading to false after fetch
        }
    }, 300);

    useEffect(() => {
        if (searchText) {
            fetchStocks(searchText);
        } else {
            setStocks([]); // Clear stocks if searchText is empty
        }
    }, [searchText]);

    return {
        stocks,
        loading,
        error, // Return error state
    };
}

export default useStocks;
