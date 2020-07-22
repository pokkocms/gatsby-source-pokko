"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
var apollo_client_1 = require("apollo-client");
var apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
var apollo_link_http_1 = require("apollo-link-http");
var node_fetch_1 = __importDefault(require("node-fetch"));
exports.createClient = function (project, token) {
    return new apollo_client_1.ApolloClient({
        link: new apollo_link_http_1.HttpLink({
            uri: "https://hon.takeoffgo.com/" + project + "/graphql",
            fetch: node_fetch_1.default,
            headers: {
                "X-Token": token,
            },
        }),
        cache: new apollo_cache_inmemory_1.InMemoryCache(),
    });
};
