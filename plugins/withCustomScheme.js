module.exports = (config) => {
    return {
        ...config,
        ios: {
            ...config.ios,
            infoPlist: {
                ...config.ios?.infoPlist,
                CFBundleURLTypes: [
                    {
                        CFBundleURLSchemes: ["myapp"],
                    },
                ],
            },
        },
    };
};
