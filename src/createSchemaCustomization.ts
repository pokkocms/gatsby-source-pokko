import { CreateSchemaCustomizationArgs } from "gatsby";
import { getDb, runSync, getAsync, allAsync } from "pokko-sync";
import { Region } from "pokko-sync/dist/api";
import { listModels } from "./sync/schema";
import { PluginOptions } from "./types";
import { buildTypes } from "./types/index";

const extractFieldType = (field: any) => {
  switch (field.type) {
    case "VALUE":
      return "[PokModule]";
    case "MEDIA":
      return "PokMedia";
    case "ENTRY":
      return "PokLink";
    case "SCALAR":
    default:
      return "String";
  }
};

const extractField = (
  project: string,
  environment: string,
  fld: any
): { type: string; resolve: (source: any) => any } => {
  return {
    type: extractFieldType(fld),
    resolve: async (source: any) => {
      const db = getDb(project, environment);

      switch (fld.type) {
        case "SCALAR": {
          const val = await getAsync(
            db,
            "select value_scalar from value_field where value_id = ? and model_field_id = ?",
            [source.value_id, fld.id]
          );

          return JSON.parse(val?.value_scalar || "{}")?.text;
        }
        case "MEDIA": {
          const val = await getAsync(
            db,
            "select value_media_id as id from value_field where value_id = ? and model_field_id = ?",
            [source.value_id, fld.id]
          );

          return val;
        }
        case "ENTRY": {
          const val = await getAsync(
            db,
            "select value_entry_id as id from value_field where value_id = ? and model_field_id = ?",
            [source.value_id, fld.id]
          );

          return val;
        }
        case "VALUE": {
          const val = await allAsync(
            db,
            `select
              vf.value_value_id as id,
              vf.value_value_id as value_id,
              m.alias as model
            from 
              value_field vf
              inner join value v on v.id = vf.value_value_id 
              inner join model m on m.id = v.model_id
            where 
              vf.value_id = ?
              and vf.model_field_id = ?
            order by
              _index`,
            [source.value_id, fld.id]
          );

          return val;
        }
      }

      return null;
    },
  };
};

export const createSchemaCustomization = async (
  args: CreateSchemaCustomizationArgs,
  pluginOptions: PluginOptions
) => {
  const { region, project, environment, token } = pluginOptions;

  if (!region) {
    throw new Error("[pokko] region not specified");
  }
  if (!project) {
    throw new Error("[pokko] project not specified");
  }
  if (!environment) {
    throw new Error("[pokko] environment not specified");
  }
  if (!token) {
    throw new Error("[pokko] token not specified");
  }

  await runSync(region as Region, project, environment, token);

  const models = await listModels(getDb(project, environment));

  args.actions.createTypes(buildTypes(project, environment, args));

  models.forEach((mod) => {
    args.actions.createTypes([
      args.schema.buildObjectType({
        name: `Pok${mod.alias}`,
        extensions: { infer: false },
        interfaces: ["Node", "PokModule"],
        fields: {
          id: "ID!",
          ...mod.fields
            .map((fld: any) => ({
              name: fld.alias as string,
              value: extractField(project, environment, fld),
            }))
            .reduce((p: any, c: any) => ({ ...p, [c.name]: c.value }), {}),
        },
      }),
    ]);
  });
};
