import { CreatePagesArgs } from "gatsby";
import { PluginOptions } from "./sourceNodes";

type Taxonomy = {
  id: string;
  path: string;
  model: string;
  entryId: string;
};

type Query = {
  allHonTaxonomy: { nodes: Taxonomy[] };
};

const query = `
{
  allHonTaxonomy {
    nodes {
      id
      path
      model
      entryId
    }
  }
}
`;

export const createPages = async (
  { actions: { createPage }, graphql }: CreatePagesArgs,
  options: PluginOptions
) => {
  if (!options.defaultTaxonomy || !options.resolveComponent) {
    return;
  }

  const result = await graphql<Query>(query);
  result.data?.allHonTaxonomy.nodes.forEach((node) => {
    try {
      const component = options.resolveComponent!(node);
      createPage({
        path: node.path,
        component,
        context: {
          entryId: node.entryId,
        },
      });
    } catch (ex) {
      console.warn(
        `[honegumi] error creating page for path '${node.path}' of type '${node.model}'`
      );
      console.warn(ex);
    }
  });
};
