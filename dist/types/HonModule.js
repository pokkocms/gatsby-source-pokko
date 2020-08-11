"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HonModule = void 0;
var honegumi_sync_1 = require("honegumi-sync");
exports.HonModule = function (project, environment, args) {
    var db = honegumi_sync_1.getDb(project, environment);
    return args.schema.buildInterfaceType({
        name: "HonModule",
        fields: {
            id: "ID!",
        },
        resolveType: function (source) { return "Hon" + source.model; },
    });
};
