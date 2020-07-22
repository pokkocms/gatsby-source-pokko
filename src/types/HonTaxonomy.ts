import { CreateSchemaCustomizationArgs } from "gatsby";

export const HonTaxonomy = (args: CreateSchemaCustomizationArgs) =>
  args.schema.buildObjectType({
    name: "HonTaxonomy",
    extensions: { infer: false },
    fields: {
      id: "ID!",
      entryId: "String",
      model: "String",
      path: "String",
    },
    interfaces: ["Node"],
  });
