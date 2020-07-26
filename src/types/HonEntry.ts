import { CreateSchemaCustomizationArgs } from "gatsby";

export const HonEntry = (
  _project: string,
  args: CreateSchemaCustomizationArgs
) =>
  args.schema.buildInterfaceType({
    name: "HonEntry",
    fields: {
      id: "ID!",
    },
  });
