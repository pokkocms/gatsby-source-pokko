"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTypes = void 0;
var HonEntry_1 = require("./HonEntry");
var HonMedia_1 = require("./HonMedia");
var HonModule_1 = require("./HonModule");
var HonTaxonomy_1 = require("./HonTaxonomy");
exports.buildTypes = function (project, environment, args) {
    return [HonEntry_1.HonEntry, HonMedia_1.HonMedia, HonModule_1.HonModule, HonTaxonomy_1.HonTaxonomy].map(function (typ) {
        return typ(project, environment, args);
    });
};
