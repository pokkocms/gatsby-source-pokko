const why = require("./dist/gatsby-node.js");

Object.keys(why).map((k) => (exports[k] = why[k]));
