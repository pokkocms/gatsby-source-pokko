import { CreateSchemaCustomizationArgs } from "gatsby";
import { getDb } from "./sync/db";
import { listModels } from "./sync/schema";
import { runSync } from "./sync/api";
import { PluginOptions } from "./types";
import { buildTypes } from "./types/index";

const extractFieldType = (field: any) => {
  switch (field.type) {
    case "modules":
      return "[HonModule]";
    case "media":
      return "HonMedia";
    case "link":
      return "HonLink";
    case "text":
    default:
      return "String";
  }
};

const extractField = (
  fld: any
): { type: string; resolve: (source: any) => any } => {
  return {
    type: extractFieldType(fld),
    resolve: (source: any) => {
      if (source.value) {
        // from module
        return source.value[fld.id];
      }

      return source[fld.id];
    },
  };
};

export const createSchemaCustomization = async (
  args: CreateSchemaCustomizationArgs,
  pluginOptions: PluginOptions
) => {
  const { project, token } = pluginOptions;

  await runSync(project, token);

  const models = await listModels(getDb(project));

  args.actions.createTypes(buildTypes(project, args));

  models
    .filter((mod) => mod.usage === "base")
    .forEach((mod) => {
      args.actions.createTypes([
        args.schema.buildInterfaceType({
          name: `Hon${mod.alias}`,
          extensions: { infer: false },
          fields: {
            ...mod.fields
              .map((fld: any) => ({
                name: fld.alias as string,
                value: extractField(fld),
              }))
              .reduce((p: any, c: any) => ({ ...p, [c.name]: c.value }), {}),
          },
        }),
      ]);
    });

  const listInterfaces = (mod: any): string[] => {
    const ret = ["Node"];

    switch (mod.usage) {
      case "entry":
        ret.push("HonEntry");
        break;
      case "module":
        ret.push("HonModule");
        break;
    }

    if (mod.inherits) {
      const inherits = JSON.parse(mod.inherits);

      inherits.forEach((id: string) => {
        const inhMod = models.find((ent) => ent.id === id);
        if (inhMod) {
          ret.push(`Hon${inhMod.alias}`);
        }
      });
    }

    return ret;
  };

  models
    .filter((mod) => mod.usage !== "base")
    .forEach((mod) => {
      args.actions.createTypes([
        args.schema.buildObjectType({
          name: `Hon${mod.alias}`,
          extensions: { infer: false },
          interfaces: listInterfaces(mod),
          fields: {
            id: "ID!",
            ...mod.fields
              .map((fld: any) => ({
                name: fld.alias as string,
                value: extractField(fld),
              }))
              .reduce((p: any, c: any) => ({ ...p, [c.name]: c.value }), {}),
          },
        }),
      ]);
    });
};
