import gql from "graphql-tag";
import { initDb, db, getStamp, storeSync } from "./db";
import { createClient } from "../api/client";
import ApolloClient from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";

export const syncQuery = gql`
  query($after: String, $skip: Int!) {
    sync(skip: $skip, take: 500, filter: { after: $after }) {
      nodes {
        id
        createdAt
        modifiedAt
        deletedAt
        type
        action
        payload
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

const loadPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  after: string | null,
  skip: number
): Promise<any[]> => {
  const res = await client.query({
    query: syncQuery,
    variables: { after, skip },
  });

  if (
    res.data.sync.pageInfo.hasNextPage &&
    skip + res.data.sync.nodes.length < res.data.sync.totalCount // TEMPORARY
  ) {
    return res.data.sync.nodes.concat(
      await loadPage(client, after, skip + res.data.sync.nodes.length)
    );
  } else {
    return res.data.sync.nodes;
  }
};

export const runSync = async (project: string, token: string) => {
  await initDb(db);
  const client = createClient(project, token);

  const after = await getStamp(db);
  console.log("gatsby-source-honegumi look for changes since", after);

  const res = await loadPage(client, after, 0);

  await storeSync(db, res);
};
