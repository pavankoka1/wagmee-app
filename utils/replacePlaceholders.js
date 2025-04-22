const replacePlaceholders = (str, ...args) => {
    return str.replace(/{([0-9]+)}/g, function (match, index) {
        return typeof args[index] === "undefined" ? match : `${args[index]}`;
    });
};

export default replacePlaceholders;
