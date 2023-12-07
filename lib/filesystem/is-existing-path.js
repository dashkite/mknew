"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExistingPath = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const is_system_error_1 = require("../utilities/is-system-error");
/**
 * Asynchronous version of `fs.exists`.
 */
const isExistingPath = async (path) => {
    return promises_1.default
        .stat(path)
        .then(() => true)
        .catch((error) => {
        if ((0, is_system_error_1.isSystemError)(error) && error.code === 'ENOENT') {
            return false;
        }
        throw error;
    });
};
exports.isExistingPath = isExistingPath;
//# sourceMappingURL=is-existing-path.js.map