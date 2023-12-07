"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResolvedTemplateText = void 0;
const get_template_placeholders_1 = require("./get-template-placeholders");
/**
 * Replace all placeholders in a string.
 */
const getResolvedTemplateText = async (text, getReplacement) => {
    let lastIndex = 0;
    let output = '';
    for await (const { prompt, start, end } of (0, get_template_placeholders_1.getTemplatePlaceholders)(text)) {
        output += text.slice(lastIndex, start);
        output += await getReplacement(prompt);
        lastIndex = end;
    }
    return output + text.slice(lastIndex);
};
exports.getResolvedTemplateText = getResolvedTemplateText;
//# sourceMappingURL=get-resolved-template-text.js.map