"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplatePlaceholders = void 0;
/**
 * Find all of the placeholders in template text.
 */
const getTemplatePlaceholders = function* (text) {
    const expression = /\{{3}[ \t]*([^~{}\r\n \t][^~{}\r\n]*?)[ \t]*\}{3}|~{3}[ \t]*([^~{}\r\n \t][^~{}\r\n]*?)[ \t]*~{3}/gu;
    let match = null;
    while (null != (match = expression.exec(text))) {
        yield { end: expression.lastIndex, prompt: match[1] || match[2], start: match.index };
    }
};
exports.getTemplatePlaceholders = getTemplatePlaceholders;
//# sourceMappingURL=get-template-placeholders.js.map