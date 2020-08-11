import { CreateSchemaCustomizationArgs } from "gatsby";
import { listModels } from "../sync/schema";
import { getDb } from "honegumi-sync";

export const HonModule = (
  project: string,
  environment: string,
  args: CreateSchemaCustomizationArgs
) => {
  const db = getDb(project, environment);

  return args.schema.buildInterfaceType({
    name: "HonModule",
    fields: {
      id: "ID!",
    },
    resolveType: (source) => `Hon${source.model}`,
  });
};
