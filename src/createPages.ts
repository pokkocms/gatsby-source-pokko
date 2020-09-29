import { CreatePagesArgs } from "gatsby";
import { PluginOptions, TaxonomyNode } from "./types";

type Query = {
  allPokTaxonomy: { nodes: TaxonomyNode[] };
};

const query = `
{
  allPokTaxonomy {
    nodes {
      id
      taxonomyPath: path
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
  const { taxonomy } = options;
  if (!taxonomy) {
    return;
  }
  const result = await graphql<Query>(query);

  if (result.errors) {
    console.warn("[pokko] createPages query failed", result.errors);
  }

  if (!result.data?.allPokTaxonomy.nodes) {
    return;
  }

  const matches = taxonomy.filter
    ? result.data.allPokTaxonomy.nodes.filter(taxonomy.filter)
    : result.data.allPokTaxonomy.nodes;

  matches.forEach((node) => {
    try {
      const component = taxonomy.resolveComponent(node);
      const context = {
        id: node.id,
        taxonomyPath: node.taxonomyPath,
        model: node.model,
        entryId: node.entryId,
      };
      const path = node.taxonomyPath;

      createPage({
        component,
        context,
        path,
      });
    } catch (ex) {
      console.warn(
        `[pokko] error creating page for path '${node.taxonomyPath}' of type '${node.model}'`
      );
      console.warn(ex);
    }
  });
};
