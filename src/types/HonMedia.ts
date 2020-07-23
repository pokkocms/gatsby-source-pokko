import { CreateSchemaCustomizationArgs } from "gatsby";
import { createRemoteFileNode } from "gatsby-source-filesystem";
import { getAsync, db } from "../sync/db";

export const HonMedia = (args: CreateSchemaCustomizationArgs) =>
  args.schema.buildObjectType({
    name: "HonMedia",
    extensions: { infer: false },
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
            getCache: args.getCache,
            createNode: args.actions.createNode,
            createNodeId: args.createNodeId,
            store: args.store,
            reporter: args.reporter,
          } as any);

          return fileNode;
        },
      },
    },
  });
