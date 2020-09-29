import { CreateSchemaCustomizationArgs, GatsbyGraphQLType } from "gatsby";
import { createRemoteFileNode } from "gatsby-source-filesystem";

export const PokMedia = (
  project: string,
  _environment: string,
  args: CreateSchemaCustomizationArgs
): GatsbyGraphQLType =>
  args.schema.buildObjectType({
    name: "PokMedia",
    extensions: { infer: false },
    fields: {
      id: "ID!",
      url: {
        type: "String",
        resolve: async (source: any) => {
          const url = `https://d2urwbt8hp3c27.cloudfront.net/${project}/${source.id}`;

          return url;
        },
      },
      file: {
        type: "File",
        resolve: async (source: any) => {
          const url = `https://d2urwbt8hp3c27.cloudfront.net/${project}/${source.id}`;

          const fileNode = await createRemoteFileNode({
            url,
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
