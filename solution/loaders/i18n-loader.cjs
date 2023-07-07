module.exports = function (content) {
    const options = this.getOptions();
    let result = content;
    for (const key in options) {
        const element = options[key];

        result = result.replace(`i18n('${key}')`, element);
    }

    return content;
};
