import { CreateSchemaCustomizationArgs } from "gatsby";
import { listModels } from "../sync/schema";
import { db } from "../sync/db";

export const HonModule = (args: CreateSchemaCustomizationArgs) =>
  args.schema.buildInterfaceType({
    name: "HonModule",
    fields: {
      id: "ID!",
    },
    resolveType: async (source) => {
      const models = await listModels(db);

      const model = models.find((mod) => mod.id === source.type);

      return `Hon${model.alias}`;
    },
  });
