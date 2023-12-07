"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPromptKey = void 0;
/**
 * Get a normalized key from a formatted template prompt.
 */
const getPromptKey = (value) => {
    const trimmed = value.trim();
    switch (trimmed) {
        case '&template':
        case 'template.basename':
            return { isBuiltIn: true, key: 'template.basename' };
        case '&target':
        case 'target.basename':
            return { isBuiltIn: true, key: 'target.basename' };
        case '&year':
        case 'date.year':
            return { isBuiltIn: true, key: 'date.year' };
        case '&name':
        case 'git.user.name':
            return { isBuiltIn: true, key: 'git.user.name' };
        case '&email':
        case 'git.user.email':
            return { isBuiltIn: true, key: 'git.user.email' };
    }
    return {
        isBuiltIn: false,
        key: trimmed
            .toLocaleLowerCase()
            .replace(/[\s:;.,!?_=-]+/g, '-')
            .replace(/(?:^-+|-+$)/g, ''),
    };
};
exports.getPromptKey = getPromptKey;
//# sourceMappingURL=get-prompt-key.js.map