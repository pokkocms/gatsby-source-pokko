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
var honegumi_sync_1 = require("honegumi-sync");
var schema_1 = require("./sync/schema");
var index_1 = require("./types/index");
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
var extractField = function (project, environment, fld) {
    return {
        type: extractFieldType(fld),
        resolve: function (source) { return __awaiter(void 0, void 0, void 0, function () {
            var db, _a, val, val, val, val;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        db = honegumi_sync_1.getDb(project, environment);
                        _a = fld.type;
                        switch (_a) {
                            case "text": return [3 /*break*/, 1];
                            case "media": return [3 /*break*/, 3];
                            case "link": return [3 /*break*/, 5];
                            case "modules": return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1: return [4 /*yield*/, honegumi_sync_1.getAsync(db, "select value_scalar from value_field where value_id = ? and model_field_id = ?", [source.value_id, fld.id])];
                    case 2:
                        val = _c.sent();
                        return [2 /*return*/, (_b = JSON.parse((val === null || val === void 0 ? void 0 : val.value_scalar) || "{}")) === null || _b === void 0 ? void 0 : _b.text];
                    case 3: return [4 /*yield*/, honegumi_sync_1.getAsync(db, "select value_media_id as id from value_field where value_id = ? and model_field_id = ?", [source.value_id, fld.id])];
                    case 4:
                        val = _c.sent();
                        return [2 /*return*/, val];
                    case 5: return [4 /*yield*/, honegumi_sync_1.getAsync(db, "select value_entry_id as id from value_field where value_id = ? and model_field_id = ?", [source.value_id, fld.id])];
                    case 6:
                        val = _c.sent();
                        return [2 /*return*/, val];
                    case 7: return [4 /*yield*/, honegumi_sync_1.allAsync(db, "select\n              vf.value_value_id as id,\n              vf.value_value_id as value_id,\n              m.alias as model\n            from \n              value_field vf\n              inner join value v on v.id = vf.value_value_id \n              inner join model m on m.id = v.model_id\n            where \n              vf.value_id = ?\n              and vf.model_field_id = ?\n            order by\n              _index", [source.value_id, fld.id])];
                    case 8:
                        val = _c.sent();
                        return [2 /*return*/, val];
                    case 9: return [2 /*return*/, null];
                }
            });
        }); },
    };
};
exports.createSchemaCustomization = function (args, pluginOptions) { return __awaiter(void 0, void 0, void 0, function () {
    var project, environment, token, models;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                project = pluginOptions.project, environment = pluginOptions.environment, token = pluginOptions.token;
                return [4 /*yield*/, honegumi_sync_1.runSync(project, environment, token)];
            case 1:
                _a.sent();
                return [4 /*yield*/, schema_1.listModels(honegumi_sync_1.getDb(project, environment))];
            case 2:
                models = _a.sent();
                args.actions.createTypes(index_1.buildTypes(project, environment, args));
                models.forEach(function (mod) {
                    args.actions.createTypes([
                        args.schema.buildObjectType({
                            name: "Hon" + mod.alias,
                            extensions: { infer: false },
                            interfaces: ["Node", "HonModule"],
                            fields: __assign({ id: "ID!" }, mod.fields
                                .map(function (fld) { return ({
                                name: fld.alias,
                                value: extractField(project, environment, fld),
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
