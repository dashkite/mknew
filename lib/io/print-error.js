"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printError = void 0;
const chalk_1 = __importDefault(require("chalk"));
/**
 * Print an error message to stderr (with color).
 *
 * This also sets `process.exitCode` to a value of `2` if it is not already
 * non-zero.
 */
const printError = (error) => {
    console.error(process.env.NODE_ENV === 'development' ? error : chalk_1.default.redBright(`${error?.message ?? error}`));
    process.exitCode = process.exitCode || 2;
};
exports.printError = printError;
//# sourceMappingURL=print-error.js.map