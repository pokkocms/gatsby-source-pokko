import { CreateNodeArgs } from "gatsby";
import { createRemoteFileNode } from "gatsby-source-filesystem";

export const onCreateNode = async ({
  actions: { createNode },
  getCache,
  createNodeId,
  node,
}: CreateNodeArgs) => {
  // console.log('onCreateNode', node)
  // if (node.internal.type.startsWith("Hon")) {
  //   const fileNode = await createRemoteFileNode({
  //     url: node.imgUrl as string,
  //     getCache,
  //     createNode,
  //     createNodeId,
  //     parentNodeId: node.id,
  //   } as any);

  //   if (fileNode) {
  //     // used to add a field `remoteImage` to the Post node from the File node in the schemaCustomization API
  //     node.remoteImage = fileNode.id;

  //     // inference can link these without schemaCustomization like this, but creates a less sturdy schema
  //     // node.remoteImage___NODE = fileNode.id
  //   }
  // }
};
