import { CreateSchemaCustomizationArgs } from "gatsby";

export const HonEntry = (
  _project: string,
  _environment: string,
  args: CreateSchemaCustomizationArgs
) =>
  args.schema.buildInterfaceType({
    name: "HonEntry",
    fields: {
      id: "ID!",
    },
  });
