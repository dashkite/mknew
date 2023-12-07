"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printWarning = void 0;
const chalk_1 = __importDefault(require("chalk"));
/**
 * Print a warning message to stderr (with color).
 *
 * This also sets `process.exitCode` to a value of `1` if it is not already
 * non-zero.
 */
const printWarning = (error) => {
    console.error(chalk_1.default.yellowBright(`${error}`));
    process.exitCode = 1;
};
exports.printWarning = printWarning;
//# sourceMappingURL=print-warning.js.map