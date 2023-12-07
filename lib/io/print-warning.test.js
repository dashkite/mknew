"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const print_warning_1 = require("./print-warning");
describe('printWarning', () => {
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
        (0, print_warning_1.printWarning)('message');
        expect(process.exitCode).toBe(1);
        expect(messages).toMatchInlineSnapshot(`
Array [
  Array [
    "[93mmessage[39m",
  ],
]
`);
    });
    test('Error', () => {
        (0, print_warning_1.printWarning)(new Error('message'));
        expect(messages).toMatchInlineSnapshot(`
Array [
  Array [
    "[93mError: message[39m",
  ],
]
`);
    });
    test('toString', () => {
        (0, print_warning_1.printWarning)({ toString: () => 'message' });
        expect(messages).toMatchInlineSnapshot(`
Array [
  Array [
    "[93mmessage[39m",
  ],
]
`);
    });
});
//# sourceMappingURL=print-warning.test.js.map