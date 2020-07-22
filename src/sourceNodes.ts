import { SourceNodesArgs } from "gatsby";
import { allAsync, db } from "./sync/db";

export type PluginOptions = {
  token: string;
  project: string;
  root: string[];
  taxonomySkip?: number;
};

export const sourceNodes = async function sourceNodes(
  args: SourceNodesArgs,
  pluginOptions: PluginOptions
) {
  const { taxonomySkip } = pluginOptions;

  const entries = await allAsync(
    db,
    "select e.*, m.alias as __model from entry e inner join model m on e.model_id = m.id"
  );
  entries.forEach((ent) => {
    const value = JSON.parse(ent.value || "{}");
    args.actions.createNode({
      internal: {
        contentDigest: args.createContentDigest(value),
        type: `Hon${ent.__model}`,
        content: JSON.stringify(value),
      },
      ...value,
      id: args.createNodeId(`hon-${ent.id}`),
    });
  });

  const taxDyn = await allAsync(
    db,
    `
select
    t.id,
    t.config,
    t.path,
    m.alias as model,
    e.id as entryid,
    e.value
from
    taxonomy t
        inner join json_each(t.config, '$.models') mid
        inner join model m on m.id = mid.value
        inner join entry e on e.model_id = m.id or m.inherits like e.model_id
where
    t.type = 'dynamic';
    `
  );

  taxDyn.forEach((ent) => {
    const buildPath = (input: any): string | null => {
      const ret: string[] = JSON.parse(input.path).filter(
        (_: any, idx: number) => idx >= (taxonomySkip || 0)
      );
      const config = JSON.parse(input.config);
      const value = JSON.parse(input.value);

      if (config.aliasField && config.fragmentType && config.fragmentField) {
        const alias = value[config.aliasField];

        if (config.fragmentType.startsWith("date")) {
          const dt = new Date(value[config.fragmentField]);

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
        return "/" + [...ret, value[config.aliasField]].join("/");
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
    const value = {
      entryId: args.createNodeId(`hon-${ent.entryid}`),
      model: ent.model,
      path:
        "/" +
        JSON.parse(ent.path)
          .filter((_: any, idx: number) => idx >= (taxonomySkip || 0))
          .join("/"),
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
