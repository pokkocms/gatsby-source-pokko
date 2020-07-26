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
exports.listModels = void 0;
// import { camelCase } from "change-case";
var db_1 = require("./db");
// const modelToField = (
//   model: any,
//   fields: any[]
// ): {
//   name: string;
//   type: graphql.GraphQLObjectType;
//   resolve: graphql.GraphQLFieldResolver<any, any>;
// } | null => {
//   const flds = fields.filter((fld) => fld.model_id === model.id);
//   if (flds.length === 0) {
//     return null;
//   }
//   return {
//     name: camelCase(model.alias),
//     resolve: () => {},
//     type: new graphql.GraphQLObjectType({
//       name: model.alias,
//       fields: flds
//         .map((fld) => ({
//           name: fld.alias,
//           type: graphql.GraphQLString,
//         }))
//         .reduce((p, c) => ({ ...p, [c.name]: { type: c.type } }), {}),
//     }),
//   };
// };
exports.listModels = function (db) { return __awaiter(void 0, void 0, void 0, function () {
    var models, fields;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.allAsync(db, "select * from model")];
            case 1:
                models = _a.sent();
                return [4 /*yield*/, db_1.allAsync(db, "select * from model_field")];
            case 2:
                fields = _a.sent();
                return [2 /*return*/, models.map(function (mod) { return (__assign(__assign({}, mod), { fields: fields.filter(function (ent) {
                            return ent.model_id === mod.id ||
                                (mod.inherits || "").indexOf(ent.model_id) !== -1;
                        }) })); })];
        }
    });
}); };
// export const dbToSchema = async (
//   db: sqlite3.Database
// ): Promise<graphql.GraphQLSchema> => {
//   const models = await allAsync(db, `select * from model`);
//   const fields = await allAsync(db, `select * from model_field`);
//   const types = models.map((model) => ({
//     model,
//     type: modelToField(model, fields),
//   }));
//   const query = new graphql.GraphQLObjectType({
//     name: "Hon_Query",
//     fields: {
//       honegumi: {
//         type: new graphql.GraphQLObjectType({
//           name: "Hon_Query2",
//           fields: types
//             .filter(({ type }) => type !== null)
//             .filter(({ model }) => model.usage === "entry")
//             .reduce(
//               (p, { type }) => ({
//                 ...p,
//                 [type!.name]: {
//                   type: type!.type,
//                   resolve: type!.resolve,
//                 },
//               }),
//               {}
//             ),
//         }),
//       },
//     },
//   });
//   const schema = new graphql.GraphQLSchema({
//     query,
//     types: types
//       .filter(({ type }) => type !== null)
//       .map(({ type }) => type!.type) as graphql.GraphQLNamedType[],
//   });
//   return schema;
// };
