"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeClassName = mergeClassName;
function mergeClassName(base, extra) {
    return extra ? `${base} ${extra}`.trim() : base;
}
