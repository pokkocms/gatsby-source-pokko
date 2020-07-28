import { SourceNodesArgs } from "gatsby";
import { allAsync, getDb } from "honegumi-sync";
import { PluginOptions } from "../types";

export const entries = async (
  args: SourceNodesArgs,
  pluginOptions: PluginOptions
) => {
  const db = getDb(pluginOptions.project);
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
};
