import { CreateSchemaCustomizationArgs, GatsbyGraphQLType } from "gatsby";

export const PokTaxonomy = (
  _project: string,
  _environment: string,
  args: CreateSchemaCustomizationArgs
): GatsbyGraphQLType =>
  args.schema.buildObjectType({
    name: "PokTaxonomy",
    extensions: { infer: false },
    fields: {
      id: "ID!",
      entryId: "String",
      model: "String",
      path: "String",
    },
    interfaces: ["Node"],
  });
