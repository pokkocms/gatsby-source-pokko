export type TaxonomyNode = {
  id: string;
  taxonomyPath: string;
  model: string;
  entryId: string;
};

export type PluginOptions = {
  token: string;
  project: string;
  taxonomy?: {
    skip?: number;
    filter?: (input: TaxonomyNode) => boolean;
    resolveComponent: (input: TaxonomyNode) => string;
  };
};
