"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HonEntry = void 0;
exports.HonEntry = function (args) {
    return args.schema.buildInterfaceType({
        name: "HonEntry",
        fields: {
            id: "ID!",
        },
    });
};