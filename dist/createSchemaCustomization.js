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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchemaCustomization = void 0;
var db_1 = require("./sync/db");
var schema_1 = require("./sync/schema");
var api_1 = require("./sync/api");
var types_1 = require("./types");
var extractFieldType = function (field) {
    switch (field.type) {
        case "modules":
            return "[HonModule]";
        case "media":
            return "HonMedia";
        case "link":
            return "HonLink";
        case "text":
        default:
            return "String";
    }
};
var extractField = function (fld) {
    return {
        type: extractFieldType(fld),
        resolve: function (source) {
            if (source.value) {
                // from module
                return source.value[fld.id];
            }
            return source[fld.id];
        },
    };
};
exports.createSchemaCustomization = function (args, pluginOptions) { return __awaiter(void 0, void 0, void 0, function () {
    var project, token, models, listInterfaces;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                project = pluginOptions.project, token = pluginOptions.token;
                return [4 /*yield*/, api_1.runSync(project, token)];
            case 1:
                _a.sent();
                return [4 /*yield*/, schema_1.listModels(db_1.db)];
            case 2:
                models = _a.sent();
                args.actions.createTypes(types_1.buildTypes(args));
                models
                    .filter(function (mod) { return mod.usage === "base"; })
                    .forEach(function (mod) {
                    args.actions.createTypes([
                        args.schema.buildInterfaceType({
                            name: "Hon" + mod.alias,
                            extensions: { infer: false },
                            fields: __assign({}, mod.fields
                                .map(function (fld) { return ({
                                name: fld.alias,
                                value: extractField(fld),
                            }); })
                                .reduce(function (p, c) {
                                var _a;
                                return (__assign(__assign({}, p), (_a = {}, _a[c.name] = c.value, _a)));
                            }, {})),
                        }),
                    ]);
                });
                listInterfaces = function (mod) {
                    var ret = ["Node"];
                    switch (mod.usage) {
                        case "entry":
                            ret.push("HonEntry");
                            break;
                        case "module":
                            ret.push("HonModule");
                            break;
                    }
                    if (mod.inherits) {
                        var inherits = JSON.parse(mod.inherits);
                        inherits.forEach(function (id) {
                            var inhMod = models.find(function (ent) { return ent.id === id; });
                            if (inhMod) {
                                ret.push("Hon" + inhMod.alias);
                            }
                        });
                    }
                    return ret;
                };
                models
                    .filter(function (mod) { return mod.usage !== "base"; })
                    .forEach(function (mod) {
                    args.actions.createTypes([
                        args.schema.buildObjectType({
                            name: "Hon" + mod.alias,
                            extensions: { infer: false },
                            interfaces: listInterfaces(mod),
                            fields: __assign({ id: "ID!" }, mod.fields
                                .map(function (fld) { return ({
                                name: fld.alias,
                                value: extractField(fld),
                            }); })
                                .reduce(function (p, c) {
                                var _a;
                                return (__assign(__assign({}, p), (_a = {}, _a[c.name] = c.value, _a)));
                            }, {})),
                        }),
                    ]);
                });
                return [2 /*return*/];
        }
    });
}); };
