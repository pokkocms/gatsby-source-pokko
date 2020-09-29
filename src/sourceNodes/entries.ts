import { SourceNodesArgs } from "gatsby";
import { allAsync, getDb } from "pokko-sync";
import { PluginOptions } from "../types";

export const entries = async (
  args: SourceNodesArgs,
  pluginOptions: PluginOptions
) => {
  const { project, environment } = pluginOptions;
  const db = getDb(project, environment);
  const entries = await allAsync(
    db,
    "select e.id, e.value_id, m.alias as model from entry e inner join model m on e.model_id = m.id"
  );
  entries.forEach((ent) => {
    args.actions.createNode({
      internal: {
        contentDigest: args.createContentDigest(ent),
        type: `Pok${ent.model}`,
        content: JSON.stringify(ent),
      },
      ...ent,
      id: args.createNodeId(`pok-${ent.id}`),
    });
  });
};
