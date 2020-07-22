import { CreateSchemaCustomizationArgs } from "gatsby";
import { PluginOptions } from "./sourceNodes";
import { db, getAsync } from "./sync/db";
import { listModels } from "./sync/schema";
import { runSync } from "./sync/api";
import { createRemoteFileNode } from "gatsby-source-filesystem";

const resolveValue = (field: any, source: any) => {
  return source[field.id];
};

const extractFieldType = (field: any) => {
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

const extractField = (
  fld: any
): { type: string; resolve: (source: any) => any } => {
  return {
    type: extractFieldType(fld),
    resolve: (source: any) => resolveValue(fld, source),
  };
};

export const createSchemaCustomization = async (
  args: CreateSchemaCustomizationArgs,
  pluginOptions: PluginOptions
) => {
  const { project, token } = pluginOptions;

  await runSync(project, token);

  const models = await listModels(db);

  args.actions.createTypes([
    args.schema.buildObjectType({
      name: "HonMedia",
      fields: {
        id: "ID!",
        url: {
          type: "String",
          resolve: async (source: any) => {
            const item = await getAsync(
              db,
              `select * from media_item where id = ?`,
              [source.id]
            );
            if (!item) {
              return null;
            }

            const storage = JSON.parse(item.storage);

            return storage.public + "/" + storage.path;
          },
        },
        file: {
          type: "File",
          resolve: async (source: any) => {
            const item = await getAsync(
              db,
              `select * from media_item where id = ?`,
              [source.id]
            );
            if (!item) {
              return null;
            }

            const storage2 = JSON.parse(item.storage);
            const fileNode = await createRemoteFileNode({
              url: storage2.public + "/" + source.id,
              parentNodeId: source.id,
              cache: args.cache,
              createNode: args.actions.createNode,
              createNodeId: args.createNodeId,
              store: args.store,
              reporter: args.reporter,
            });

            return fileNode.id;
          },
        },
      },
    }),
    args.schema.buildInterfaceType({
      name: "HonEntry",
      fields: {
        id: "ID!",
      },
    }),
    args.schema.buildInterfaceType({
      name: "HonModule",
      fields: {
        id: "ID!",
      },
      resolveType: (source) => {
        const model = models.find((mod) => mod.id === source.type);

        return `Hon${model.alias}`;
      },
    }),
  ]);

  models
    .filter((mod) => mod.usage === "base")
    .forEach((mod) => {
      args.actions.createTypes([
        args.schema.buildInterfaceType({
          name: `Hon${mod.alias}`,
          extensions: { infer: false },
          fields: {
            ...mod.fields
              .map((fld: any) => ({
                name: fld.alias as string,
                value: extractField(fld),
              }))
              .reduce((p: any, c: any) => ({ ...p, [c.name]: c.value }), {}),
          },
        }),
      ]);
    });

  const listInterfaces = (mod: any): string[] => {
    const ret = ["Node"];

    ret.push(mod.usage === "entry" ? "HonEntry" : "HonModule");

    if (mod.inherits) {
      const inherits = JSON.parse(mod.inherits);

      inherits.forEach((id: string) => {
        const inhMod = models.find((ent) => ent.id === id);
        if (inhMod) {
          ret.push(`Hon${inhMod.alias}`);
        }
      });
    }

    return ret;
  };

  models
    .filter((mod) => mod.usage !== "base")
    .forEach((mod) => {
      args.actions.createTypes([
        args.schema.buildObjectType({
          name: `Hon${mod.alias}`,
          extensions: { infer: false },
          interfaces: listInterfaces(mod),
          fields: {
            id: "ID!",
            ...mod.fields
              .map((fld: any) => ({
                name: fld.alias as string,
                value: extractField(fld),
              }))
              .reduce((p: any, c: any) => ({ ...p, [c.name]: c.value }), {}),
          },
        }),
      ]);
    });
};
