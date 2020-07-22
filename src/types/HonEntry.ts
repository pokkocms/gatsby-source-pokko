import { CreateSchemaCustomizationArgs } from "gatsby";

export const HonEntry = (args: CreateSchemaCustomizationArgs) =>
  args.schema.buildInterfaceType({
    name: "HonEntry",
    fields: {
      id: "ID!",
    },
  });
