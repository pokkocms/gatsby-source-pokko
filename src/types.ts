export type TaxonomyNode = {
  id: string;
  taxonomyPath: string;
  model: string;
  entryId: string;
};

export type PluginOptions = {
  region: string;
  token: string;
  project: string;
  environment: string;
  taxonomy?: {
    skip?: number;
    filter?: (input: TaxonomyNode) => boolean;
    resolveComponent: (input: TaxonomyNode) => string;
  };
};
