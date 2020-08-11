import { SourceNodesArgs } from "gatsby";
import { allAsync, getDb } from "honegumi-sync";
import { PluginOptions } from "../types";

export const taxonomyDynamic = async (
  args: SourceNodesArgs,
  pluginOptions: PluginOptions
) => {
  const { project, environment, taxonomy } = pluginOptions;
  const db = getDb(project, environment);

  const taxDyn = await allAsync(
    db,
    `
select
    t.id,
    t.config,
    t.path,
    m.alias as model,
    e.id as entryid,
    e.value_id as value_id,
    json_extract(vf_alias.value_scalar, '$.text') as alias,
    json_extract(vf_fragment.value_scalar, '$.text') as fragment
from
    taxonomy t
        inner join json_each(t.config, '$.models') mid
        inner join model m on m.id = mid.value
        inner join entry e on e.model_id = m.id or m.inherits like e.model_id
        left join value_field vf_alias on vf_alias.value_id = e.value_id and vf_alias.model_field_id = json_extract(t.config, '$.aliasField')
        left join value_field vf_fragment on vf_fragment.value_id = e.value_id and vf_fragment.model_field_id = json_extract(t.config, '$.fragmentField')
where
    t.type = 'dynamic';
    `
  );

  taxDyn.forEach((ent) => {
    const buildPath = (input: any): string | null => {
      const ret: string[] = JSON.parse(input.path).filter(
        (_: any, idx: number) => idx >= (taxonomy?.skip || 0)
      );
      const config = JSON.parse(input.config);
      const { alias, fragment } = input;

      if (config.aliasField && config.fragmentType && config.fragmentField) {
        if (config.fragmentType.startsWith("date")) {
          const dt = new Date(fragment);

          switch (config.fragmentType) {
            case "date_year":
              return "/" + [...ret, dt.getFullYear(), alias].join("/");
            case "date_yearmonth":
              return (
                "/" +
                [...ret, dt.getFullYear(), dt.getMonth() + 1, alias].join("/")
              );
            case "date_yearmonthday":
              return (
                "/" +
                [
                  ...ret,
                  dt.getFullYear(),
                  dt.getMonth() + 1,
                  dt.getDate(),
                  alias,
                ].join("/")
              );
          }
        }
      } else if (config.aliasField) {
        return "/" + [...ret, alias].join("/");
      }

      return null;
    };

    const path = buildPath(ent);

    if (!path) {
      return;
    }

    const value = {
      entryId: args.createNodeId(`hon-${ent.entryid}`),
      model: ent.model,
      path,
    };

    args.actions.createNode({
      internal: {
        contentDigest: args.createContentDigest(value),
        type: "HonTaxonomy",
        content: JSON.stringify(value),
      },
      ...value,
      id: args.createNodeId(`hon-tax-${value.entryId}`),
    });
  });
};

export const taxonomyStatic = async (
  args: SourceNodesArgs,
  pluginOptions: PluginOptions
) => {
  const { project, environment } = pluginOptions;
  const db = getDb(project, environment);
  const { taxonomy } = pluginOptions;

  const taxEntry = await allAsync(
    db,
    `
select
    t.id,
    t.path,
    t.entry_id as entryid,
    m.alias as model
from
    taxonomy t
        inner join entry e on t.entry_id = e.id
        inner join model m on m.id = e.model_id
where
    t.type = 'entry';
    `
  );

  taxEntry.forEach((ent) => {
    const pathAlias = JSON.parse(ent.path).filter(
      (_: any, idx: number) => idx >= (taxonomy?.skip || 0)
    );
    const path = "/" + pathAlias.join("/");

    const value = {
      entryId: args.createNodeId(`hon-${ent.entryid}`),
      model: ent.model,
      path,
    };

    args.actions.createNode({
      internal: {
        contentDigest: args.createContentDigest(value),
        type: "HonTaxonomy",
        content: JSON.stringify(value),
      },
      ...value,
      id: args.createNodeId(`hon-tax-${ent.id}`),
    });
  });
};
