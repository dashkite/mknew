"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printUsage = void 0;
/**
 * Print the usage text to stdout.
 */
const printUsage = () => {
    console.log(`
Usage: mknew [options] <template> <target>
       mknew --version
       mknew --help

Copy a template directory or file, replacing all template placeholders.
Existing files will not be overwritten.

Options:
  -s, --source <value>      Templates directory or Git repo (Default: '.')
  -w, --workspace <value>   Target root directory (Default: '.')
  --version                 Print the current version
  --help                    Print this help text
    `.trim() + '\n');
};
exports.printUsage = printUsage;
//# sourceMappingURL=print-usage.js.map