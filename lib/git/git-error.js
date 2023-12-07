"use strict";
/* istanbul ignore file */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitError = void 0;
/**
 * Error thrown when a Git command fails.
 */
class GitError extends Error {
    constructor(exitCode, output = '') {
        super(`Git command exited with a non-zero status code (${exitCode})`);
        this.name = 'GitError';
        this.toString = () => `${this.message}\n${this.output.trimStart()}`.trimEnd();
        this.exitCode = exitCode;
        this.output = output.trim();
    }
}
exports.GitError = GitError;
//# sourceMappingURL=git-error.js.map