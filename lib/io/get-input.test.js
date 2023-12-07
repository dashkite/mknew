"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const node_events_1 = __importDefault(require("node:events"));
const node_readline_1 = __importDefault(require("node:readline"));
const get_input_1 = require("./get-input");
// eslint-disable-next-line functional/no-class
class MockReadline extends node_events_1.default {
    constructor() {
        super(...arguments);
        // eslint-disable-next-line functional/prefer-readonly-type
        this.question = jest.fn();
        this.close = jest.fn();
    }
}
jest.mock('node:readline', () => {
    return {
        createInterface: jest.fn(),
    };
});
describe('getInput', () => {
    const createInterfaceMock = node_readline_1.default.createInterface;
    let readlineMock;
    // let logSpy: jest.SpyInstance;
    beforeEach(() => {
        readlineMock = new MockReadline();
        createInterfaceMock.mockReturnValue(readlineMock);
        // logSpy = jest.spyOn(console, 'log').mockReturnValue();
    });
    test('simple prompt', async () => {
        readlineMock.question.mockImplementationOnce((_, callback) => callback('foo'));
        expect(await (0, get_input_1.getInput)('hello')).toBe('foo');
        expect(readlineMock.question).toHaveBeenCalledWith(chalk_1.default.bold('hello: '), expect.any(Function));
        expect(readlineMock.close).toHaveBeenCalledTimes(1);
    });
    test('trimmed prompt', async () => {
        readlineMock.question.mockImplementationOnce((_, callback) => callback('foo'));
        expect(await (0, get_input_1.getInput)('  hello  ')).toBe('foo');
        expect(readlineMock.question).toHaveBeenCalledWith(chalk_1.default.bold('hello: '), expect.any(Function));
        expect(readlineMock.close).toHaveBeenCalledTimes(1);
    });
    test('custom punctuation', async () => {
        readlineMock.question.mockImplementationOnce((_, callback) => callback('foo'));
        expect(await (0, get_input_1.getInput)('hello?')).toBe('foo');
        expect(readlineMock.question).toHaveBeenCalledWith(chalk_1.default.bold('hello? '), expect.any(Function));
        expect(readlineMock.close).toHaveBeenCalledTimes(1);
    });
    test('interrupt', async () => {
        const promise = (0, get_input_1.getInput)('hello');
        expect(readlineMock.question).toHaveBeenCalledWith(chalk_1.default.bold('hello: '), expect.any(Function));
        readlineMock.emit('SIGINT');
        void expect(promise).rejects.toMatchInlineSnapshot(`[InputInterruptError: Interrupted]`);
        expect(readlineMock.close).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=get-input.test.js.map