"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSystemError = void 0;
const isError = (error) => {
    return error instanceof Error;
};
/**
 * Return true if the error parameter is a NodeJS `SystemError`, which has a
 * `code` and `path` property.
 */
const isSystemError = (error) => {
    return (isError(error) &&
        typeof error.code === 'string' &&
        (typeof error.path === 'string' || typeof error.path === 'undefined'));
};
exports.isSystemError = isSystemError;
//# sourceMappingURL=is-system-error.js.map