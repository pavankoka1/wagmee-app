const generateQueryParams = (endpoint, params) => {
    const queryString = Object.keys(params)
        .map(
            (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join("&");

    return `${endpoint}?${queryString}`;
};

export default generateQueryParams;
