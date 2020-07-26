// import * as graphql from "graphql";
import sqlite3 from "sqlite3";
// import { camelCase } from "change-case";
import { allAsync } from "./db";

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

export const listModels = async (db: sqlite3.Database) => {
  const models = await allAsync(db, `select * from model`);
  const fields = await allAsync(db, `select * from model_field`);

  return models.map((mod) => ({
    ...mod,
    fields: fields.filter(
      (ent) =>
        ent.model_id === mod.id ||
        (mod.inherits || "").indexOf(ent.model_id) !== -1
    ),
  }));
};

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
