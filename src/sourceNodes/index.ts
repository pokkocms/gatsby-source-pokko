import { SourceNodesArgs } from "gatsby";
import { PluginOptions } from "../types";
import { taxonomyDynamic, taxonomyStatic } from "./taxonomy";
import { entries } from "./entries";

export const sourceNodes = async function sourceNodes(
  args: SourceNodesArgs,
  pluginOptions: PluginOptions
) {
  await entries(args, pluginOptions);
  await taxonomyDynamic(args, pluginOptions);
  await taxonomyStatic(args, pluginOptions);
};
