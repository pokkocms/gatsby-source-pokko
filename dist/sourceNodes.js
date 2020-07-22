"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceNodes = void 0;
var db_1 = require("./sync/db");
exports.sourceNodes = function sourceNodes(args, pluginOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var taxonomySkip, entries, taxDyn, taxEntry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    taxonomySkip = pluginOptions.taxonomySkip;
                    return [4 /*yield*/, db_1.allAsync(db_1.db, "select e.*, m.alias as __model from entry e inner join model m on e.model_id = m.id")];
                case 1:
                    entries = _a.sent();
                    entries.forEach(function (ent) {
                        var value = JSON.parse(ent.value || "{}");
                        args.actions.createNode(__assign(__assign({ internal: {
                                contentDigest: args.createContentDigest(value),
                                type: "Hon" + ent.__model,
                                content: JSON.stringify(value),
                            } }, value), { id: args.createNodeId("hon-" + ent.id) }));
                    });
                    return [4 /*yield*/, db_1.allAsync(db_1.db, "\nselect\n    t.id,\n    t.config,\n    t.path,\n    m.alias as model,\n    e.id as entryid,\n    e.value\nfrom\n    taxonomy t\n        inner join json_each(t.config, '$.models') mid\n        inner join model m on m.id = mid.value\n        inner join entry e on e.model_id = m.id or m.inherits like e.model_id\nwhere\n    t.type = 'dynamic';\n    ")];
                case 2:
                    taxDyn = _a.sent();
                    taxDyn.forEach(function (ent) {
                        var buildPath = function (input) {
                            var ret = JSON.parse(input.path).filter(function (_, idx) { return idx >= (taxonomySkip || 0); });
                            var config = JSON.parse(input.config);
                            var value = JSON.parse(input.value);
                            if (config.aliasField && config.fragmentType && config.fragmentField) {
                                var alias = value[config.aliasField];
                                if (config.fragmentType.startsWith("date")) {
                                    var dt = new Date(value[config.fragmentField]);
                                    switch (config.fragmentType) {
                                        case "date_year":
                                            return "/" + __spreadArrays(ret, [dt.getFullYear(), alias]).join("/");
                                        case "date_yearmonth":
                                            return ("/" +
                                                __spreadArrays(ret, [dt.getFullYear(), dt.getMonth() + 1, alias]).join("/"));
                                        case "date_yearmonthday":
                                            return ("/" +
                                                __spreadArrays(ret, [
                                                    dt.getFullYear(),
                                                    dt.getMonth() + 1,
                                                    dt.getDate(),
                                                    alias,
                                                ]).join("/"));
                                    }
                                }
                            }
                            else if (config.aliasField) {
                                return "/" + __spreadArrays(ret, [value[config.aliasField]]).join("/");
                            }
                            return null;
                        };
                        var path = buildPath(ent);
                        if (!path) {
                            return;
                        }
                        var value = {
                            entryId: ent.entryid,
                            model: ent.model,
                            path: path,
                        };
                        args.actions.createNode(__assign(__assign({ internal: {
                                contentDigest: args.createContentDigest(value),
                                type: "HonTaxonomy",
                                content: JSON.stringify(value),
                            } }, value), { id: args.createNodeId("hon-tax-" + value.entryId) }));
                    });
                    return [4 /*yield*/, db_1.allAsync(db_1.db, "\nselect\n    t.id,\n    t.path,\n    t.entry_id as entryid,\n    m.alias as model\nfrom\n    taxonomy t\n        inner join entry e on t.entry_id = e.id\n        inner join model m on m.id = e.model_id\nwhere\n    t.type = 'entry';\n    ")];
                case 3:
                    taxEntry = _a.sent();
                    taxEntry.forEach(function (ent) {
                        var value = {
                            entryId: ent.entryid,
                            model: ent.model,
                            path: "/" +
                                JSON.parse(ent.path)
                                    .filter(function (_, idx) { return idx >= (taxonomySkip || 0); })
                                    .join("/"),
                        };
                        args.actions.createNode(__assign(__assign({ internal: {
                                contentDigest: args.createContentDigest(value),
                                type: "HonTaxonomy",
                                content: JSON.stringify(value),
                            } }, value), { id: args.createNodeId("hon-tax-" + ent.id) }));
                    });
                    return [2 /*return*/];
            }
        });
    });
};
