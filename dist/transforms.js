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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripNonQueryTransform = exports.NamespaceUnderFieldTransform = void 0;
var _a = require("gatsby/graphql"), GraphQLObjectType = _a.GraphQLObjectType, GraphQLNonNull = _a.GraphQLNonNull;
var _b = require("@graphql-tools/utils"), mapSchema = _b.mapSchema, MapperKind = _b.MapperKind, addTypes = _b.addTypes, modifyObjectFields = _b.modifyObjectFields;
var NamespaceUnderFieldTransform = /** @class */ (function () {
    function NamespaceUnderFieldTransform(_a) {
        var typeName = _a.typeName, fieldName = _a.fieldName, resolver = _a.resolver;
        this.typeName = typeName;
        this.fieldName = fieldName;
        this.resolver = resolver;
    }
    NamespaceUnderFieldTransform.prototype.transformSchema = function (schema) {
        var _a;
        var _this = this;
        var queryConfig = schema.getQueryType().toConfig();
        var nestedQuery = new GraphQLObjectType(__assign(__assign({}, queryConfig), { name: this.typeName }));
        var newSchema = addTypes(schema, [nestedQuery]);
        var newRootFieldConfigMap = (_a = {},
            _a[this.fieldName] = {
                type: new GraphQLNonNull(nestedQuery),
                resolve: function (parent, args, context, info) {
                    if (_this.resolver != null) {
                        return _this.resolver(parent, args, context, info);
                    }
                    return {};
                },
            },
            _a);
        newSchema = modifyObjectFields(newSchema, queryConfig.name, function () { return true; }, newRootFieldConfigMap)[0];
        return newSchema;
    };
    return NamespaceUnderFieldTransform;
}());
exports.NamespaceUnderFieldTransform = NamespaceUnderFieldTransform;
var StripNonQueryTransform = /** @class */ (function () {
    function StripNonQueryTransform() {
    }
    StripNonQueryTransform.prototype.transformSchema = function (schema) {
        var _a;
        return mapSchema(schema, (_a = {},
            _a[MapperKind.MUTATION] = function () {
                return null;
            },
            _a[MapperKind.SUBSCRIPTION] = function () {
                return null;
            },
            _a));
    };
    return StripNonQueryTransform;
}());
exports.StripNonQueryTransform = StripNonQueryTransform;
