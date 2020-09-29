import { GatsbyGraphQLType, CreateSchemaCustomizationArgs } from "gatsby";

import { PokEntry } from "./PokEntry";
import { PokMedia } from "./PokMedia";
import { PokModule } from "./PokModule";
import { PokTaxonomy } from "./PokTaxonomy";

export const buildTypes = (
  project: string,
  environment: string,
  args: CreateSchemaCustomizationArgs
): GatsbyGraphQLType[] =>
  [PokEntry, PokMedia, PokModule, PokTaxonomy].map((typ) =>
    typ(project, environment, args)
  );
