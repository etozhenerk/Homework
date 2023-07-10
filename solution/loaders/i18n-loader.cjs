module.exports = function (content) {
    const options = this.getOptions();
    let result = content;
    for (const key in options) {
        const element = options[key];
        const regexp = new RegExp(`i18n\\(('|")${key}('|")\\)`);
        console.log(regexp);
        result = result.replace(regexp, `"${element}"`);
    }
    return result;
};
