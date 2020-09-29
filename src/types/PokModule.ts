import { CreateSchemaCustomizationArgs, GatsbyGraphQLType } from "gatsby";
import { getDb } from "pokko-sync";

export const PokModule = (
  project: string,
  environment: string,
  args: CreateSchemaCustomizationArgs
): GatsbyGraphQLType => {
  const db = getDb(project, environment);

  return args.schema.buildInterfaceType({
    name: "PokModule",
    fields: {
      id: "ID!",
    },
    resolveType: (source) => `Pok${source.model}`,
  });
};
