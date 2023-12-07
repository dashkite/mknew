"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
const is_existing_path_1 = require("./is-existing-path");
jest.mock('node:fs/promises');
describe('isExistingPath', () => {
    test('true', async () => {
        promises_1.default.stat.mockResolvedValue({});
        await expect((0, is_existing_path_1.isExistingPath)('foo')).resolves.toBe(true);
    });
    test('false', async () => {
        promises_1.default.stat.mockRejectedValue(Object.assign(new Error('error'), { code: 'ENOENT' }));
        await expect((0, is_existing_path_1.isExistingPath)('foo')).resolves.toBe(false);
    });
    test('throw', async () => {
        promises_1.default.stat.mockRejectedValue(Object.assign(new Error('error')));
        await expect((0, is_existing_path_1.isExistingPath)('foo')).rejects.toBeInstanceOf(Error);
    });
});
//# sourceMappingURL=is-existing-path.test.js.map