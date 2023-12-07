"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInput = void 0;
const chalk_1 = __importDefault(require("chalk"));
const node_readline_1 = __importDefault(require("node:readline"));
const input_interrupt_error_1 = require("./input-interrupt-error");
/**
 * Get input on the command line interactively.
 */
const getInput = async (message) => {
    const readline = node_readline_1.default.createInterface(process.stdin, process.stdout);
    const promptMessage = message.trim().replace(/[=:.!?]?$/iu, (match) => match || ':');
    return new Promise((resolve, reject) => {
        readline.question(chalk_1.default.bold(`${promptMessage} `), (value) => {
            readline.close();
            resolve(value);
        });
        readline.on('SIGINT', () => {
            readline.close();
            console.log();
            reject(new input_interrupt_error_1.InputInterruptError());
        });
    });
};
exports.getInput = getInput;
//# sourceMappingURL=get-input.js.map