"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const print_usage_1 = require("./print-usage");
describe('printUsage', () => {
    const logs = [];
    const errors = [];
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation((...args) => {
            logs.push(args);
        });
        jest.spyOn(console, 'error').mockImplementation((...args) => {
            errors.push(args);
        });
    });
    afterEach(() => {
        logs.length = 0;
        errors.length = 0;
        process.exitCode = 0;
    });
    test('no error', () => {
        (0, print_usage_1.printUsage)();
        expect(logs.join('\n')).toMatch('Usage: mknew');
        expect(errors).toMatchInlineSnapshot(`Array []`);
    });
});
//# sourceMappingURL=print-usage.test.js.map