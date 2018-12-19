const api = require("./api");
const get = require("lodash.get");

const query = `
query loadSellerConversations(
  $first: Int!
  $sellerTags: String
  $sellerId: String!
) {
  viewer {
    conversationsSolr(
      first: $first
      sellerTags: $sellerTags
      sellerId: $sellerId
    ) {
      edges {
        node {
          originalBuyer {
            displayName
          }
          item {
            title
          }
          latestMessageReceivedAt(format: "MMMM Do")
          latestMessage
        }
      }
    }
  }
}
`;

module.exports = api({
  query,

  prepareVariables(options) {
    const { numUnread } = options;
    let first = numUnread || 25;
    return {
      first,
      sellerTags: "unread",
      sellerId: process.env.SELLER_ID
    };
  },

  formatMessage(response, options, variables) {
    const conversationEdges =
      get(response, "data.viewer.conversationsSolr.edges") || [];

    const conversations = conversationEdges.map(e => e.node);
    if (!conversations.length) {
      return "You have no unread messages";
    }
    let message = ["Here are your"];
    if (options.numUnread) {
      message.push(`first ${options.numUnread}`);
    }
    message.push("unread messages.");
    conversations.forEach((conv, i) => {
      const item = get(conv, "item");
      message.push(`message ${i + 1} of ${conversations.length}`);
      message.push(`from ${get(conv, "originalBuyer.displayName")}`);
      message.push(`received on ${get(conv, "latestMessageReceivedAt")}`);
      if (item) {
        message.push(`regarding ${get(item, "title")}`);
      } else {
        message.push("from your storefront");
      }
      message.push(`, ${get(conv, "latestMessage")}`);
    });
    return message.join(" ");
  }
});
