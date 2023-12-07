#!/usr/bin/env node
"use strict";
/* istanbul ignore file */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
void Promise.resolve()
    .then(async () => {
    if (process.env.NODE_ENV === 'development') {
        try {
            // eslint-disable-next-line import/no-extraneous-dependencies
            await Promise.resolve().then(() => __importStar(require('source-map-support/register')));
        }
        catch {
            // The source-map-support dependency is optional, and only installed
            // in development.
        }
    }
    return undefined;
})
    .then(async () => Promise.resolve().then(() => __importStar(require('./main'))))
    .then(async ({ main }) => main());
//# sourceMappingURL=bin.js.map