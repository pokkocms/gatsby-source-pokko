import { SourceNodesArgs } from "gatsby";
import { allAsync, db } from "./sync/db";

export type PluginOptions = {
  token: string;
  project: string;
  root: string[];
};

export const sourceNodes = async function sourceNodes(
  args: SourceNodesArgs,
  pluginOptions: PluginOptions
) {
  const { project, token } = pluginOptions;
  console.log(`honegumi project: ${project}`);

  const entries = await allAsync(
    db,
    "select e.*, m.alias as __model from entry e inner join model m on e.model_id = m.id"
  );
  entries.forEach((ent) => {
    const value = JSON.parse(ent.value || "{}");
    args.actions.createNode({
      id: args.createNodeId(`hon-${ent.id}`),
      internal: {
        contentDigest: args.createContentDigest(value),
        type: `Hon${ent.__model}`,
        content: JSON.stringify(value),
      },
      ...value,
    });
  });
};
