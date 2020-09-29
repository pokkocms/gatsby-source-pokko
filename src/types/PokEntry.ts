import { CreateSchemaCustomizationArgs, GatsbyGraphQLType } from "gatsby";

export const PokEntry = (
  _project: string,
  _environment: string,
  args: CreateSchemaCustomizationArgs
): GatsbyGraphQLType =>
  args.schema.buildInterfaceType({
    name: "PokEntry",
    fields: {
      id: "ID!",
    },
  });
