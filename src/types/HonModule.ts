import { CreateSchemaCustomizationArgs } from "gatsby";
import { listModels } from "../sync/schema";
import { getDb } from "honegumi-sync";

export const HonModule = (
  project: string,
  args: CreateSchemaCustomizationArgs
) => {
  const db = getDb(project);

  return args.schema.buildInterfaceType({
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
};
