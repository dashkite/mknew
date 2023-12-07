"use strict";
/* istanbul ignore file */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputInterruptError = void 0;
/**
 * Error thrown when `getInput` is interrupted (ie. SIGINT).
 */
class InputInterruptError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'InputInterruptError';
        this.message = 'Interrupted';
        this.toString = () => this.message;
    }
}
exports.InputInterruptError = InputInterruptError;
//# sourceMappingURL=input-interrupt-error.js.map