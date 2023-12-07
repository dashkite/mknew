"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGitSource = void 0;
/**
 * Parse a git URL into the important parts (eg. url, path, and branch).
 */
const parseGitSource = (source) => {
    const match = source.match(
    // eslint-disable-next-line unicorn/no-unsafe-regex
    /^((?:(?:git(?:\+ssh)?|ssh|https?):\/{2}(?:[^#\r\n]*?(?=\.git(?:[/#]|$)|#|$))|[-\w.]+@[^:#\r\n]*:[^#\r\n]*?(?:[^#\r\n]*?(?=\.git(?:[/#]|$)|#|$))|file:[^#\r\n]*?\.git(?=[/#]|$))(?:\.git(?=[/#]|$))?)(?:\/+([^#\r\n]*))?(?:#(.*))?$/);
    return match ? { branch: match[3] || undefined, path: match[2] || undefined, url: match[1] } : null;
};
exports.parseGitSource = parseGitSource;
//# sourceMappingURL=parse-git-source.js.map