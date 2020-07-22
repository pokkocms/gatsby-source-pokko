"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HonTaxomony = void 0;
exports.HonTaxomony = function (schema) {
    return schema.buildObjectType({
        name: "HonTaxonomy",
        extensions: { infer: false },
        fields: {
            id: "ID!",
            entryId: "String",
            model: "String",
            path: "String",
        },
        interfaces: ["Node"],
    });
};
