"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HonTaxonomy = void 0;
exports.HonTaxonomy = function (_project, _environment, args) {
    return args.schema.buildObjectType({
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
