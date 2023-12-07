"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const print_error_1 = require("./print-error");
describe('printError', () => {
    const messages = [];
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation((...args) => {
            messages.push(args);
        });
    });
    afterEach(() => {
        messages.length = 0;
        process.exitCode = 0;
    });
    test('string', () => {
        (0, print_error_1.printError)('message');
        expect(process.exitCode).toBe(2);
        expect(messages).toMatchInlineSnapshot(`
Array [
  Array [
    "[91mmessage[39m",
  ],
]
`);
    });
    test('Error', () => {
        (0, print_error_1.printError)(new Error('message'));
        expect(messages).toMatchInlineSnapshot(`
Array [
  Array [
    "[91mmessage[39m",
  ],
]
`);
    });
    test('toString', () => {
        (0, print_error_1.printError)({ toString: () => 'message' });
        expect(messages).toMatchInlineSnapshot(`
Array [
  Array [
    "[91mmessage[39m",
  ],
]
`);
    });
});
//# sourceMappingURL=print-error.test.js.map