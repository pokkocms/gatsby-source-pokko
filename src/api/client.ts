import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

import fetch from "node-fetch";

export const createClient = (project: string, token: string) =>
  new ApolloClient({
    link: new HttpLink({
      uri: `https://hon.takeoffgo.com/${project}/graphql`,
      fetch: fetch as any,
      headers: {
        "X-Token": token,
      },
    }),
    cache: new InMemoryCache(),
  });
