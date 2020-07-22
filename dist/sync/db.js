"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeSync = exports.initDb = exports.getStamp = exports.getAsync = exports.allAsync = exports.db = void 0;
var sqlite3_1 = __importDefault(require("sqlite3"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var cachePath = path_1.default.join(process.cwd(), ".cache");
if (!fs_1.default.existsSync(cachePath)) {
    fs_1.default.mkdirSync(cachePath);
}
var dbFile = path_1.default.join(cachePath, "gatsby-source-honegumi.sqlite3");
exports.db = new sqlite3_1.default.Database(dbFile);
var execAsync = function (db, sql) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                db.exec(sql, function (err) {
                    err ? reject(err) : resolve();
                });
            })];
    });
}); };
var runAsync = function (db, sql, params) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                db.run(sql, params, function (err) {
                    err ? reject(err) : resolve();
                });
            })];
    });
}); };
exports.allAsync = function (db, sql) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                db.all(sql, function (err, res) {
                    err ? reject(err) : resolve(res);
                });
            })];
    });
}); };
exports.getAsync = function (db, sql, params) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                db.get(sql, params, function (err, res) {
                    err ? reject(err) : resolve(res);
                });
            })];
    });
}); };
exports.getStamp = function (db) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getAsync(db, "select max(modified_at) as stamp from sync")];
            case 1:
                res = _a.sent();
                return [2 /*return*/, (res === null || res === void 0 ? void 0 : res.stamp) || null];
        }
    });
}); };
exports.initDb = function (db) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, execAsync(db, "create table if not exists sync (\n    id text not null,\n    created_at text not null,\n    modified_at text not null,\n    deleted_at text,\n    type text not null,\n    action text not null,\n    payload text not null,\n    primary key ( id )\n  ) without rowid")];
            case 1:
                _a.sent();
                return [4 /*yield*/, execAsync(db, "create table if not exists model (\n    id text not null,\n    alias text not null,\n    value_base text not null,\n    inherits text not null,\n    usage text not null,\n    primary key ( id )\n  ) without rowid")];
            case 2:
                _a.sent();
                return [4 /*yield*/, execAsync(db, "create table if not exists model_field (\n    id text not null,\n    model_id text not null,\n    alias text not null,\n    type text not null,\n    config text not null,\n    primary key ( id ),\n    foreign key ( model_id ) references model ( id )\n  ) without rowid")];
            case 3:
                _a.sent();
                return [4 /*yield*/, execAsync(db, "create table if not exists entry (\n    id text not null,\n    model_id text not null,\n    value text not null,\n    primary key ( id ),\n    foreign key ( model_id ) references model ( id )\n  ) without rowid")];
            case 4:
                _a.sent();
                return [4 /*yield*/, execAsync(db, "create table if not exists media_item (\n    id text not null,\n    content_type text not null,\n    storage text not null,\n    size text not null,\n    primary key ( id )\n  ) without rowid")];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.storeSync = function (db, data) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, data_1, record, params, _a, _b, params_1, _c, params_2, _d, params_3, _e, params_4;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _i = 0, data_1 = data;
                _f.label = 1;
            case 1:
                if (!(_i < data_1.length)) return [3 /*break*/, 28];
                record = data_1[_i];
                params = [
                    record.id,
                    new Date(parseInt(record.createdAt, 10)).toISOString(),
                    new Date(parseInt(record.modifiedAt, 10)).toISOString(),
                    record.deletedAt
                        ? new Date(parseInt(record.deletedAt, 10)).toISOString()
                        : null,
                    record.type,
                    record.action,
                    JSON.stringify(record.payload),
                ];
                return [4 /*yield*/, runAsync(db, "insert into sync ( id, created_at, modified_at, deleted_at, type, action, payload ) values ( ?, ?, ?, ?, ?, ?, ?)", params)];
            case 2:
                _f.sent();
                _a = record.type;
                switch (_a) {
                    case "entry": return [3 /*break*/, 3];
                    case "model": return [3 /*break*/, 9];
                    case "model_field": return [3 /*break*/, 15];
                    case "media_item": return [3 /*break*/, 21];
                }
                return [3 /*break*/, 27];
            case 3:
                _b = record.action;
                switch (_b) {
                    case "create": return [3 /*break*/, 4];
                    case "change": return [3 /*break*/, 4];
                    case "delete": return [3 /*break*/, 6];
                }
                return [3 /*break*/, 8];
            case 4:
                params_1 = [
                    record.id,
                    record.payload.model_id,
                    JSON.stringify(record.payload.value),
                ];
                return [4 /*yield*/, runAsync(db, "replace into entry ( id, model_id, value ) values ( ?, ?, ? )", params_1)];
            case 5:
                _f.sent();
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, runAsync(db, "delete from entry where id = ?", [record.id])];
            case 7:
                _f.sent();
                return [3 /*break*/, 8];
            case 8: return [3 /*break*/, 27];
            case 9:
                _c = record.action;
                switch (_c) {
                    case "create": return [3 /*break*/, 10];
                    case "change": return [3 /*break*/, 10];
                    case "delete": return [3 /*break*/, 12];
                }
                return [3 /*break*/, 14];
            case 10:
                params_2 = [
                    record.id,
                    record.payload.alias,
                    JSON.stringify(record.payload.value_base) || "{}",
                    JSON.stringify(record.payload.inherits),
                    record.payload.usage,
                ];
                return [4 /*yield*/, runAsync(db, "replace into model ( id, alias, value_base, inherits, usage ) values ( ?, ?, ?, ?, ? )", params_2)];
            case 11:
                _f.sent();
                return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, runAsync(db, "delete from model where id = ?", [record.id])];
            case 13:
                _f.sent();
                return [3 /*break*/, 14];
            case 14: return [3 /*break*/, 27];
            case 15:
                _d = record.action;
                switch (_d) {
                    case "create": return [3 /*break*/, 16];
                    case "change": return [3 /*break*/, 16];
                    case "delete": return [3 /*break*/, 18];
                }
                return [3 /*break*/, 20];
            case 16:
                params_3 = [
                    record.id,
                    record.payload.model_id,
                    record.payload.alias,
                    record.payload.type,
                    JSON.stringify(record.payload.config),
                ];
                return [4 /*yield*/, runAsync(db, "replace into model_field ( id, model_id, alias, type, config ) values ( ?, ?, ?, ?, ? )", params_3)];
            case 17:
                _f.sent();
                return [3 /*break*/, 20];
            case 18: return [4 /*yield*/, runAsync(db, "delete from model_field where id = ?", [
                    record.id,
                ])];
            case 19:
                _f.sent();
                return [3 /*break*/, 20];
            case 20: return [3 /*break*/, 27];
            case 21:
                _e = record.action;
                switch (_e) {
                    case "create": return [3 /*break*/, 22];
                    case "change": return [3 /*break*/, 22];
                    case "delete": return [3 /*break*/, 24];
                }
                return [3 /*break*/, 26];
            case 22:
                params_4 = [
                    record.id,
                    record.payload.content_type,
                    JSON.stringify(record.payload.storage),
                    record.payload.size,
                ];
                return [4 /*yield*/, runAsync(db, "replace into media_item ( id, content_type, storage, size ) values ( ?, ?, ?, ? )", params_4)];
            case 23:
                _f.sent();
                return [3 /*break*/, 26];
            case 24: return [4 /*yield*/, runAsync(db, "delete from model_field where id = ?", [
                    record.id,
                ])];
            case 25:
                _f.sent();
                return [3 /*break*/, 26];
            case 26: return [3 /*break*/, 27];
            case 27:
                _i++;
                return [3 /*break*/, 1];
            case 28: return [2 /*return*/];
        }
    });
}); };
