import { GatsbyGraphQLType, CreateSchemaCustomizationArgs } from "gatsby";

import { HonEntry } from "./HonEntry";
import { HonMedia } from "./HonMedia";
import { HonModule } from "./HonModule";
import { HonTaxonomy } from "./HonTaxonomy";

export const buildTypes = (
  project: string,
  environment: string,
  args: CreateSchemaCustomizationArgs
): GatsbyGraphQLType[] =>
  [HonEntry, HonMedia, HonModule, HonTaxonomy].map((typ) =>
    typ(project, environment, args)
  );
